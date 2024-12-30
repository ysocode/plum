export default function route(name, parameters = [], absolute = true) {
    return {
        name,
        parameters,
        absolute
    };
}
