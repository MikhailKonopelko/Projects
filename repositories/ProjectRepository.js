/**
 * Project Repository implementation
 * Implements IProjectRepository interface
 */
class ProjectRepository {
  /**
   * @param {Model} ProjectModel - Sequelize Project model
   */
  constructor(ProjectModel) {
    if (!ProjectModel) {
      throw new Error('ProjectModel is required');
    }
    this.Project = ProjectModel;
  }

  /**
   * Finds all projects
   * @returns {Promise<IProject[]>} Promise resolving to an array of projects
   */
  async findAll(options = {}) {
    const { transaction } = options;
    return await this.Project.findAll({ transaction });
  }

  /**
   * Finds a project by ID
   * @param {number} id - The project ID
   * @returns {Promise<IProject|null>} Promise resolving to a project or null
   */
  async findById(id, options = {}) {
    const { transaction, identityMap } = options;

    if (identityMap && identityMap.has('Project', id)) {
      return identityMap.get('Project', id);
    }

    const project = await this.Project.findByPk(id, { transaction });
    if (project && identityMap) {
      identityMap.set('Project', id, project);
    }
    return project;
  }

  /**
   * Returns a lazy-loading proxy for a project to defer loading of programmers
   * Implements a simple Lazy Load for associated entities
   */
  async findByIdWithLazyProgrammers(id, options = {}) {
    const { transaction, identityMap } = options;
    const baseProject = await this.findById(id, { transaction, identityMap });
    if (!baseProject) return null;

    let programmersLoaded = false;
    let programmersCache = null;

    const proxy = new Proxy(baseProject, {
      get(target, prop, receiver) {
        if (prop === 'programmers') {
          return (async () => {
            if (programmersLoaded) return programmersCache;
            // Use association loader; only pass transaction if it is still active
            const options = {};
            if (transaction && !transaction.finished) {
              options.transaction = transaction;
            }
            programmersCache = await target.getProgrammers(options);
            programmersLoaded = true;
            return programmersCache;
          })();
        }
        return Reflect.get(target, prop, receiver);
      }
    });

    return proxy;
  }
}

module.exports = ProjectRepository;

