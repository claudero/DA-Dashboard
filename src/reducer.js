export default (props = {}, action) => {
    if (action.type === 'PLAYGROUND_HOME') {
        return {module: 'ReferencePlayground'};
    }
    if (action.type === 'DA_HOME') {
        return {module: 'DA_Home'};
    }
    if (action.type === 'CHANGE_MODULE') {
        return Object.assign({}, props, { module : action.module, submodule : action.submodule});
    }
    return props;
};
