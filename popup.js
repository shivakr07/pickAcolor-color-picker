const btn  = document.querySelector('.changeColorBtn');

const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');


btn.addEventListener('click', async() => {
    // console.log('clicked');

    const color = chrome.storage.sync.get('color', () =>{
        console.log('color: ', color);
    });

    let [tab] = await chrome.tabs.query({active: true , currentWindow : true });
    // console.log(tab);m
    // it gives an object and first item is info about current tab 
    // and it contains id of the tab

    chrome.scripting.executeScript({ //using this we inject a script in tab
        target : {tabId : tab.id},
        function : pickColor,
    }, 
    
    async(injectionResults) => {
        
        const [data] = injectionResults;
        if (data.result){
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color;
            // console.log(injectionResults);
            colorValue.innerText = color  ;

            try{
                await navigator.clipboard.writeText(color);
            }catch(err){
                console.error(err);
            }
            
        }
    });
});


async function pickColor(){
    // console.log('script working');
    try{
        //picker
        //we get api of eye droper of browser native api's
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();

    } catch(err){
        console.error(err);
    }
}