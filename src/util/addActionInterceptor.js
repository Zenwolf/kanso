
// addActionInterceptor :: List[x] -> x -> List[x]
function addActionInterceptor(list, interceptor) {
    if (list.includes(interceptor)) {
        return list;
    }

    return actionInterceptors.push(interceptor);
}
