export default class ProjectRepository {
  
  constructor(ProjectModel) {
    if (!ProjectModel) {
      throw new Error('ProjectModel is required');
    }
    this.Project = ProjectModel;
  }

  async findAll(options = {}) {
    const { transaction } = options;
    return await this.Project.findAll({ transaction });
  }

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
