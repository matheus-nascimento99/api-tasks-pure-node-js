export const buildRoutePath = (path) => {
    const routeParemetersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(routeParemetersRegex, '(?<$1>[a-z0-9\-_]+)');

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

    return pathRegex;
}