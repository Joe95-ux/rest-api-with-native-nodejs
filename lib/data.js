/*
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

//container for the module (to be exported)
let lib = {};

//base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//write data to a file
lib.create = function(dir,file,data,callback){
    //open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            const stringData = JSON.stringify(data);

            //write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file');
                        }
                    })
                    
                }else{
                    callback('Error writing to new file');
                }
            });
        }else{
            callback('Could not create new file, it may already exist');
        }

    });
}

//Read data from a file
lib.read = function(dir, file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err, data){
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        }else{
            callback(err, data);
        }
    })
}

//update data inside a file
lib.update = function(dir,file,data,callback){
    //open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+',function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
           const stringData = JSON.stringify(data);

            //Truncate the file
            fs.ftruncate(fileDescriptor,function(err){
                if(!err){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error closing existing file');
                                }
                            });
                        }else{
                            callback('Error writing to existing file')
                        }
                    });
                }else{
                    callback('Error truncating file');
                }
            });
        }else{
            callback('Could not open file for updating, it may not exist yet');
        }
    })
}

//Delete a file
lib.delete = function(dir,file,callback){
    //unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file');
        }
    });
}


//List all the items in a directory
lib.list = function(dir,callback){
    fs.readdir(lib.baseDir+dir+'/',function(err,data){
        if(!err && data && data.length > 0){
            let trimmedFileNames = [];
            data.forEach(function(fileName){
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false,trimmedFileNames);

        }else{
            callback(err, data)
        }
    })
}


//export the module

module.exports = lib;