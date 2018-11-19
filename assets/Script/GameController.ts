// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import Ball from "./Ball";
import Barrier from "./Barrier";
import Vec2 = cc.Vec2;
import Config from "./Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property([cc.Prefab])
    preBarriuer: cc.Prefab[] = [];
    @property(cc.Prefab)
    preBall: cc.Prefab = null;

    @property(cc.Label)
    totalScoreLable: cc.Label = null;

    @property([Ball])
    balls: Ball[] = [];
    barriers: Barrier[] = [];

    recyleBallCount:number=1;

    score: number=0;

    onLoad() {
        this.addBarriers();
        this.addScore();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.balls[0].gController=this;
        this.balls[0].node.group=Config.groupBallInRecyle;
    }

    onTouchStart(touch: cc.Event.EventTouch) {
        if (!this.isRecyleBallFinsh()){
            return;
        }
        this.recyleBallCount=0;

        let touchPos = this.node.convertTouchToNodeSpaceAR(touch.touch);
        this.shootBalls(touchPos.sub(cc.v2(0, 237)))
    }

    shootBall(ball: Ball, dir: cc.Vec2) {
        ball.rigidBody.active = false;
        let poses: cc.Vec2[] = [];
        poses.push(ball.node.position);
        poses.push(cc.v2(0, 237));
        ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.8, poses, 0.5),
            cc.callFunc(function () {
                ball.rigidBody.active = true;
                let v = cc.v2(dir);
                ball.rigidBody.linearVelocity = v.mulSelf(3);
            }),
        ));
    }

    shootBalls(dir: cc.Vec2) {
        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            this.scheduleOnce(function () {
                this.shootBall(ball, dir);
            }.bind(this), i * 0.3);


        }
    }

    recyleBall(){
        this.recyleBallCount++;
        if (this.isRecyleBallFinsh()){//收集完成
            for(let i=0;i<this.barriers.length;i++){
                this.barriers[i].node.runAction(cc.moveBy(0.5,cc.v2(0,100)));
            }
            this.addBarriers();
        }
    }
    isRecyleBallFinsh(){
        return this.recyleBallCount==this.balls.length;
    }
    addBalls(pos: cc.Vec2) {
        let ball = cc.instantiate(this.preBall).getComponent<Ball>(Ball);
        this.node.addChild(ball.node);
        ball.node.position = pos;
        ball.node.group=Config.groupBallInGames;
        ball.gController=this;
        this.balls.push(ball);

    }

    addScore() {
        this.totalScoreLable.string= this.score++;

    }

    /**
     * 动态添加障碍物
     */
    addBarriers() {
        let startPosX = -250;
        let endPosX = 210;

        let currentPosX = startPosX + this.getRandomSpace();

        while (currentPosX < endPosX) {
            console.log("dss" + currentPosX);
            let barrier = cc.instantiate(this.preBarriuer[Math.floor(Math.random() * this.preBarriuer.length)]).getComponent<Barrier>(Barrier);
            this.node.addChild(barrier.node);
            barrier.node.position = cc.v2(currentPosX, -410);
            barrier.node.rotation = Math.random() * 360;
            barrier.gController = this;
            currentPosX += this.getRandomSpace();
            this.barriers.push(barrier);
        }
    }

    removeBarriers(barrier: Barrier) {
        let id = this.barriers.indexOf(barrier);
        if (id != -1) {
            barrier.node.removeFromParent(false);
            this.barriers.splice(id, 1);
        }
    }

    getRandomSpace(): number {
        return 60 + Math.random() * 100;
    }

    // update (dt) {}
}
