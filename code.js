words = words.replace(/[.|,|#]/g, ' ');
words = words.replace(/\s\s+/g, ' ');
words = words.toLocaleLowerCase();

result = words.split(' ')
    .filter(word => word != null && word.trim() != '')
    .reduce(function(map, obj) {

    if (map[obj]) {
        map[obj]++;
    } else {
        map[obj] = 1;
    }
    return map;
}, {});
