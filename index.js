const inputSlider= document.querySelector("[data-length-slider]");
const length = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-message]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generate-password");
const allChechBox= document.querySelectorAll("input[type=checkbox]");

const symbols="~`!@#$%^&*(){}[];:'<>?/.,\|-+";

let password="";
let passwordLength =10;
let checkCount=0;
handleSlider();
// set strength circle color to gray
setIndicator('#ccc');
// set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    length.innerText=passwordLength;
    
    const min = inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min))+ "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color; 
    // shadow
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;

}
function getRndInteger(min,max){
    return Math.floor(Math.random() *(max-min))+min
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const random= getRndInteger(0,symbols.length);
    return symbols.charAt(random);
}
function calcsstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol ) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower|| hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed"
    }
   copyMsg.classList.add("active");

   setTimeout( ()=> {
    copyMsg.classList.remove("active");
   },2000);
    
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
function handleCheckBoxChange(){
    checkCount=0;
    allChechBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount=checkCount+1;
        }
    })
    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allChechBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',()=>{

    if(checkCount<=0){
        return;
    }
    if(passwordLength < checkCount){
        passwordLength =  checkCount
        handleSlider();
    }
    //  removing old password
    password="";
    //  functions array
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber); 
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //  compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    //  remaining addition

    for(let i=0; i<passwordLength-funcArr.length;i++){
        let RandomIndx= getRndInteger(0,funcArr.length);
        password += funcArr[RandomIndx]();
    }

    password = shufflePassword(Array.from(password));
    
    passwordDisplay.value= password;
    calcsstrength();
});

function shufflePassword(array){
    // using Fisher Yates method
    for(let i=array.length-1;i>0;i--){
        const j= Math.floor(Math.random()* (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]= temp;
    }
    let str="";
    array.forEach((el)=>(str += el));
    return str;
}
