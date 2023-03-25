function read_csv(csv_data, sep) {
    const rtn_val = []

    const myArray = csv_data.split("\n");
    
    
    let labels = myArray[0].split(sep)
    for (let i = 1; i < myArray.length; i++) {
        if(myArray[i].length < 1) { continue }
        
        let row = myArray[i].split(sep)

        let elem = {}
        for (let j = 0; j < labels.length; j++) {
            elem[labels[j]] = row[j]
        }
        rtn_val.push(elem)
    }
    
    
    return rtn_val;
    
    
}
