cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        scoreLabel:{
            default:null,
            type:cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        if(undefined !== Global && Global.score >0){
            this.scoreLabel.string = '最终分数 ：'+ Global.score;
        }
        
    },
    
    onStartGame: function(){
        cc.director.loadScene('game');
    },

    

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    }
});
