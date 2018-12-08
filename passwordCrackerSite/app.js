var passwordTester = (function () {
    var lengthOfKey = 1;
    var valueToTest = '';
    var keyInputDom = document.getElementsByClassName("key-size")[0];
    var stringInputDom = document.getElementsByClassName("string-to-dencrypt")[0];
    var valuesDom = document.getElementsByClassName("value-container")[0];

    var listArgonclick = (function(){
        var expanded = false;
        return function (e) {
            expanded = !expanded;
            if (expanded){
                this.style.height = '';
                this.children[1].style.display = 'flex';
            } else {
                this.style.height = '40px';
                this.children[1].style.display = 'none';
            }
        }
    })();

    var okBtn = document.getElementsByClassName("ok-btn")[0];
    for (var i = 1; i <= 5; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i;

        keyInputDom.appendChild(opt);
    }

    keyInputDom.onchange = function (e) {
        lengthOfKey = this.value;
    }
    stringInputDom.oninput = function (e) {
        valueToTest = this.value;
    }

    var httpGetAsync = function (theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("POST", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }

    var writeAnswer = function (answer) {
        while (valuesDom.children[0]) {
            valuesDom.removeChild(valuesDom.children[0]);
        }
        for (var key in answer) {
            var argDom = listArg(key, answer[key]);
            argDom.onclick = listArgonclick;
            argDom.style.height = '40px';
            valuesDom.appendChild(argDom);
        }
        console.log(answer)

    }
    var listArg = function (key, argument) {
        var container = document.createElement('div');
        container.classList.add('list-arg');
        var title = document.createElement('span');
        title.innerText = 'more then '+key+'% of Decrypted Text is letters/number.' ;

        var content = document.createElement('div');
        content.style.flexDirection = 'column';
        content.style.display = 'flex';
        content.style.backgroundColor = 'white';

        for (var possibleKey in argument){
            var opt = document.createElement('div');
            var optTitle = document.createElement('span');
            opt.appendChild(optTitle);
            optTitle.innerText = 'result for key "'+possibleKey + '"' ;
            var optContent = document.createElement('div');
            optContent.style.padding = '5px';
            optContent.classList.add('wordwrap');
            optTitle.style.backgroundColor = 'lightblue';
            optTitle.style.textAlign = 'center';
            opt.style.display = 'flex';
            opt.style['flexDirection'] = 'column';
            optContent.innerText = argument[possibleKey]
            opt.appendChild(optContent)


            content.appendChild(opt);
        }
        container.appendChild(title);
        container.appendChild(content)
        content.style.display = 'none';
        return container;
    }

    okBtn.onclick = function (e) {
        const fixedString = '[' + valueToTest.replace(/\[|\]/, '') + ']';
        const url = "http://localhost:8080/getPossibleKey";
        this.style.cursor = "progress";

        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keySize: Number(lengthOfKey),
                textToDecrypt: fixedString
            })
        }).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            console.log(JSON.stringify(myJson));
            // var text = response.text();
            // text && text.json();
            writeAnswer(myJson);
            document.body.style.cursor = "auto";

            // console.log(text)
        });

    }


})();

