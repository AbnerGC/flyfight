cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.pool =  null;
        this.canvas = null;
    },
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
        game:{
            default:null,
            serializable:false
        }
    },

    // use this for initialization
    onLoad: function () {
    },
    init:function(game){
        this.game = game;
        this.node.zIndex = 2;
        this.node.setPosition(cc.p(20 + (cc.random0To1()*160),this.node.parent.height+200));
        this.autoFlotage();
    },
    flotage:function(duration){
        let moving = cc.moveTo(duration, cc.p({x:0,y: -this.node.parent.height + 20 }));
        let cb = cc.callFunc(this.moveEnd, this);
        this.node.runAction(cc.repeat(cc.sequence(moving,cb),1));
    },

    autoFlotage:function(){
         // 以秒为单位的时间间隔
        var interval = 5;
        // 重复次数
        var repeat = 2;
        // 开始延时
        var delay = 1;
        this.schedule(()=>{
            // 这里的 this 指向 component
            console.log('asdasd111');
            console.log(this);
            this.flotage(3);
        },1);
        
     
    },
    

    moveEnd: function(){
          this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // }
});
