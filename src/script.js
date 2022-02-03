const socket = io();
var $ = (a) => document.querySelector(a);

var _vue = new Vue({
    el : "#app",
    data : {
        page : "main",
        user : "",
        codes : [],
        viewingCodeId : "0",
        kodHeartColor : "#111",
        viewingCodeLikes : "",
        isLiked : "false"
    },
    methods : {
        register(){
            socket.emit("getUsersToServer","getUsersToServer");
        },
        login(){
            $ = (a) => document.querySelector(a);
            if($("#loginUsername").value.split("").length == $("#loginUsername").value.split("").filter(a => a == " ").length || $("#loginPassword").value.split("").length == $("#loginPassword").value.split("").filter(a => a == " ").length) return alert("Lütfen Boş Yer Bırakmayın ! ");
            
            socket.emit("getUsersToServer","getUsersToServer");
        },
        getCodes(){
            socket.emit("getCodesToServer","getCodesToServer");
        },
        viewCode(i){
            this.page = "kod";
            socket.emit("getCodeLikesToServer",this.codes[i].codeId);
            this.viewingCodeId = i;
            this.isLiked = "false";

        },
        likeCode(){
            console.log(this.isLiked)
            if(this.isLiked == "true" || this.viewingCodeLikes.includes(this.user)) return alert("Zaten beğenmişsiniz ! ");
            this.isLiked = "true";
            this.viewingCodeLikes.push(this.user);
            let codeId = this.codes[this.viewingCodeId].codeId;
            let user = this.user;
            socket.emit("newLikeToServer",{
                code : codeId,
                user : user
            });
            this.kodHeartColor = "red";
        },
        addCode(){
            $ = (a) => document.querySelector(a);

            if($("#kodEkleCodeName").value.split("").length == $("#kodEkleCodeName").value.split("").filter(a => a == " ").length  || $("#kodEkleCodeArea").value.split("").length == $("#kodEkleCodeArea").value.split("").filter(a => a == " ").length) return alert("Lütfen Boş Yer Bırakmayın ! ");
            if($("#kodEkleCodeName").value.split("").length < 10) return alert("Kod ismi en az 10 karakterli olmalıdır ! ");
            if($("#kodEkleCodeDescription").value.split("").length < 20) return alert("Kod açıklaması en az 20 karakterli olmalıdır ! ");

            let user = this.user;

            socket.emit("newCodeToServer",{
                name:$("#kodEkleCodeName").value,
                description:$("#kodEkleCodeDescription").value,
                owner:user,
                code:$("#kodEkleCodeArea").value,
                codeId : ""
            });

            alert("Kodunuz onaylandıktan sonra yayınlanacaktır.");
            this.page = "main";
        }
    }
});

socket.on("getCodeLikesToClient",data => {
    _vue.viewingCodeLikes = data;
    if(data.includes(_vue.user)){
    _vue.kodHeartColor = "red";
    }else{
    _vue.kodHeartColor = "#111";
    };
});

socket.on("getCodesToClient",data => {
    _vue.codes = data[0].filter(a => data[1].includes(a.codeId));
});

socket.on("getUsersToClient",data => { 
    if($("#registerNickname").value){
         $ = (a) => document.querySelector(a);
                if($("#registerNickname").value.split("").length == $("#registerNickname").value.split("").filter(a => a == " ").length || $("#registerUsername").value.split("").length == $("#registerUsername").value.split("").filter(a => a == " ").length || $("#registerPassword").value.split("").length == $("#registerPassword").value.split("").filter(a => a == " ").length) return alert("Lütfen Boş Yer Bırakmayın ! ");
                if($("#registerNickname").value.split("").length < 3) return alert("Takma ad en az 3 karakterli olmalı ! ");
                if($("#registerUsername").value.split("").length < 6) return alert("Kullanıcı adı en az 6 karakterli olmalı ! ");
                if($("#registerPassword").value.split("").length < 8) return alert("Şifre en az 8 karakterli olmalı ! ");
                if(data){
                    if(data.map(a => a.nickName).includes($("#registerNickname").value)) return alert("Bu Takma Ad Kullanılmaktadır ! ");
                    if(data.map(a => a.userName).includes($("#registerUsername").value)) return alert("Bu Kullanıcı Adı Kullanılmaktadır ! ");
    
                    socket.emit("newUserToServer",{
                        nickName : $("#registerNickname").value,
                        userName : $("#registerUsername").value,
                        password : $("#registerPassword").value
                    });

                    this.user = $("#registerNickname").value;

                    this.page = "main";
                };
    }else{
        $ = (a) => document.querySelector(a);

        if(!data.map(a => a.userName).includes($("#loginUsername").value) || $("#loginPassword").value != data[data.map(a=>a.userName).indexOf($("#loginUsername").value)].password) return alert("Kullanıcı adı veya şifre yanlış ! ");

        _vue.user = data[data.map(a=>a.userName).indexOf($("#loginUsername").value)].nickName;

        _vue.page = "main";
    };
});
