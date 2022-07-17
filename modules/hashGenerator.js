const crypto = require("crypto");

function generate9(){
    var id = "";
    for(var i = 0; i < 6; i++) id += Math.floor(Math.random() * 10);
    id = crypto.createHash('sha256').update(id).digest('hex');
    const offset = Math.floor(Math.random() * 56);
    id = id.slice(offset, offset + 9);

    return id;
}

module.exports = {
    generate9
}