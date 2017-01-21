
result = words.split(' ').reduce(function(map, obj) {
    if (map[obj]) {
        map[obj]++;
    } else {
        map[obj] = 1;
    }
    return map;
}, {});
