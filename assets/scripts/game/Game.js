cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.bgAdId = null;
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
        bgAudio: {
            default: null,
            url: cc.AudioClip
        },
        sEnemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        PlayerPrefab: {
            default: null,
            type: cc.Prefab
        },
        lifeLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        FlotagePrefabs: {
            default: [],
            type: cc.Prefab
        },
        curDieCount: 0,
        lifeCount: 0,
        isGameover: 0,
        enemyPool: null,
        playerPool: null,
        flotagePool: null,
        maxLift: 0
    },

    createPrefabToPool: function (pool, prefab,idx) {
        var node = cc.instantiate(prefab);
        node.zIndex = idx;
        pool.put(node);
        return node;
    },

    getNodeToPool: function (pool, compontentName, prefab,idx) {
        let node = null;
        if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = pool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            if (compontentName != 'Player') {
                this.createPrefabToPool(pool, prefab,idx);
                node = pool.get();
            }
        }
        if (node) {
            node.parent = this.node; // 将生成的敌人加入节点树
            node.getComponent(compontentName).init(this);
        }
        return node;
    },

    initPool: function (pool, prefab, count,idx) {

        pool = new cc.NodePool();
        for (let i = 0; i < count; i++) {
            this.createPrefabToPool(pool, prefab,idx);
        }
        return pool;
    },
    initAllNodePool: function () {
        this.enemyPool = this.initPool(this.enemyPool, this.sEnemyPrefab, 5,3);
        this.playerPool = this.initPool(this.playerPool, this.PlayerPrefab, this.lifeCount,3);
        this.flotagePool = this.initPool(this.flotagePool, this.FlotagePrefabs[0], 5,3);
    },

    // use this for initialization
    onLoad: function () {
        window.Global = {
            score: 0
        };

        this.bgAdId =  cc.audioEngine.play(this.bgAudio,true);
        this.initAllNodePool();
        this.spawnNewPlayer();
        for (let i = 0; i < 3; i++) {
            this.spawnEnemy();
        }

        for(let i=0;i<2;i++){
            this.spawnFlotage();
        }

    },
    spawnEnemy: function () {

        let node = this.getNodeToPool(this.enemyPool, 'Enemy', this.sEnemyPrefab,3);
    },
    spawnFlotage: function () {

        let node = this.getNodeToPool(this.flotagePool, 'mapFlotage', this.FlotagePrefabs[0],2);
    },
    spawnNewPlayer: function () {
        console.log('spawnNewPlayerspawnNewPlayerspawnNewPlayer',this.curDieCount,this.maxLift);
        if (this.curDieCount < this.maxLift) {
            this.curDieCount++;
            this.lifeCount -= 1;
            this.lifeLabel.string = 'life : ' + this.lifeCount;
            var node = this.getNodeToPool(this.playerPool, 'Player', this.PlayerPrefab);
        } else {
            this.isGameover = -1;
            var player = cc.instantiate(this.PlayerPrefab);
            var Enemy = cc.instantiate(this.sEnemyPrefab);
            player.getComponent('Player').disManage();
            Enemy.getComponent('Enemy').disManage();
            
            cc.audioEngine.stop(this.bgAdId);
            // this.node.destroyAllChildren();
            console.log('sdhfksdhfkdshfkhsfjhssd');
            cc.director.loadScene('gameover');
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
