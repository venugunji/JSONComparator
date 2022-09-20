var numberConstructor = Number('123').constructor;
var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = ({}).constructor;

function whatIsIt(object) {
  if (object === null) {
      return "null";
  }
  if (object === undefined) {
      return "undefined";
  }
  if (object.constructor === numberConstructor) {
    return "Number";
}
  if (object.constructor === stringConstructor) {
      return "String";
  }
  if (object.constructor === arrayConstructor) {
      return "Array";
  }
  if (object.constructor === objectConstructor) {
      return "Object";
  }
  {
      return "don't know";
  }
}


//Parameters: jsonObj1 - the object for matching
//jsonObj2 - an object to match against.
function xyz(jsonObj1,jsonObj2, breadcrumb){
  console.log("Method Call Parameters: Start ");
  console.log(jsonObj1);
  console.log(jsonObj2);
  console.log(breadcrumb);
  console.log("Method Call Parameters: End");

  var setOfMismatchedKeys = new Set();
  
        //Search if all keys and values of JSON 1  are present in JSON 2
    $.each(jsonObj1, function(key1,value1){
// console.log(key1 +" -" +value1);

      let typeOfValue1 = whatIsIt(value1);
      
      //Check 1: is Key present
      if (jsonObj2.hasOwnProperty(key1)) {
        var value2 = jsonObj2[key1];       
        let typeOfValue2 = whatIsIt(value2);
          if( typeOfValue1 === typeOfValue2 ){
              
              if(typeOfValue1 == "Number"){
                  if( value1 != value2){
                    setOfMismatchedKeys.add(breadcrumb +"."+ key1);
                  }
      
              }else if(typeOfValue1 == "String"){
                if( value1 != value2){
                  setOfMismatchedKeys.add(breadcrumb +"."+ key1);
                }
    
            }else if( typeOfValue1 =="Object"){
                var set2 = xyz(value1,value2, breadcrumb+"."+key1);

               setOfMismatchedKeys =  union(setOfMismatchedKeys,set2);

              }else if(typeOfValue1 == "Array"){                
                if(value1.length == value2.length){

                     for(let i = 0; i < value1.length; i++) {
                        let arrayItemFromValue1 = value1[i];
                        var set2 = new Set();
                        var abortLoop2 = false;
                      for( let j =0; j<value2.length && !abortLoop2; j++){
                        let arrayItemFromValue2 = value2[j];
                        set2 = xyz(arrayItemFromValue1, arrayItemFromValue2, breadcrumb+"."+key1+"["+i+"]"+".");
                        if(set2.size == 0){
                          set2 = new Set(); //If a match is found reset and break;
                          abortLoop2 = true;
                        }
                      }
                    setOfMismatchedKeys = union(setOfMismatchedKeys,set2);
                    
                }

                }else{
                  setOfMismatchedKeys.add(breadcrumb +"."+ key1);
                }
      
              }
          }else {
            setOfMismatchedKeys.add(breadcrumb +"."+ key1);
          }
     } else{
      setOfMismatchedKeys.add(breadcrumb +"."+ key1);
    }


    });

    return setOfMismatchedKeys;
}

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

$(document).ready(function() {

// var jsonText1 = '{"FirstName":"venu","demographic":{"location":"phoenix"},"marks":[{"physics":"100"},{"chemistry":"100"}],"totals":[111,222]}';
// var jsonText2 = '{"FirstName":"venu","demographic":{"location":"chandler"},"marks":[{"physics":"100"},{"chemistry":"100"}]}';

var jsonText1 = '{"FirstName":"venu","lastname":"gunji","demographic":{"location":"phoenix","location2":"arizona"},"marks":[{"physics":"100"},{"chemistry":"100"}]}';
var jsonText2 = '{"FirstName":"raj","lastname":"abc","demographic":{"location":"chandler","location2":"arizona"},"marks":[{"physics":"100"},{"chemistry":"1000"}]}';

let jsonObj1;
let jsonObj2;
// Steps:
// 1. ADD 2 text boxes to read jsons and read into variables.
// 2. Validate the JSONs
        //2.1 Validate JSON 1
          try {
              jsonObj1 =  jQuery.parseJSON(jsonText1);
            }
            catch (err) {
              //Invalid json Obj
              console.log("Invalid JsonText 1");
            }
          //2.2 Validate JSON 2
          try {
            jsonObj2 = jQuery.parseJSON(jsonText2);
          }
          catch (err) {
            //Invalid json Obj
            console.log("Invalid JsonText 2");
          }

// 3. If valid, sort them alphabetically.
// 4. Loop over each key. If JSON Object, go in and get each key.
        
    var mismatchedSet = xyz(jsonObj1,jsonObj2,"");

    if(mismatchedSet.size > 0){
      console.log(mismatchedSet);
    }

});
