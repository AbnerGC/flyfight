cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.pool =  null;
        this.canvas = null;
        this.x;
        this.count=0;
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
    getX:function(){
         console.log('before',this.x);
         return  this.x = 20 + (cc.random0To1()*500) * Math.ceil(cc.randomMinus1To1());
    },
    test:function(){
        
       return  cc.place(cc.p(this.getX(),this.node.parent.height+200))
    },
    init:function(game){
        this.game = game;
        this.node.zIndex = 2;
        
        this.getX();
        console.log(this.x);
        this.node.setPosition(cc.p(this.x,this.node.parent.height+200));  
        this.flotage(8);
    },
    flotage:function(duration){
        
        let moving = cc.moveTo(duration, cc.p({x:this.x,y: -this.node.parent.height + 20 }));
    
        let cb = cc.callFunc(this.moveEnd, this);
        this.node.runAction(cc.repeatForever(cc.sequence(moving,this.test())));
    },    

    moveEnd: function(){
          this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // }
});
