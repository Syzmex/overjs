
// OverJs
// 2015-12-12

import is from 'whatitis';
import invariant from 'invariant';

// f = uN
const friction = ( force ) => ( factor ) => ( isRelativeRest ) => {
  return isRelativeRest ? 0 : force * factor;
};

// G = mg
const gravity = ( mass ) => ( gravityAcceleration ) => {
  return mass * gravityAcceleration;
};

// a = f/m
const acceleration = ( mass ) => ( force ) => {
  return force / mass;
};

// airResistance = 1/2CρSv²
// factor ≈ 1/2Cρ
const airResistance = ( factor ) => ( square ) => ( velocity ) => {
  return resistanceFactor * velocity * velocity * square;
};

/**
 * 空间定义
 * 重力默认垂直屏幕向里
 * options {
 *   angle { rotateX: 0 rotateY: 0 rotateZ: 0 }
 *   g: (gravityAcceleration) 9.8
 *   c: (airResistanceFactor) 0.2
 * }
 */
function space( options ) {

}

/**
 * 参照物
 * options {
 *   shape: object
 * }
 */
function reference( options ) {

}

/**
 * 物体
 * options {
 *   angle { rotateX: 0 rotateY: 0 rotateZ: 0 }
 *   position: { x y z }
 *   class:  dot | line | plane | solid
 *   type: rectangle | square | circle | ellipse | polygon | shape
 *   size: { width height depth }
 *   u: (frictionFactor) 0.2
 * }
 */
function object( options ) {

}

/**
 * 面
 * options {
 *   angle { rotateX: 0 rotateY: 0 rotateZ: 0 }
 *   position: { x y z }
 *   type: rectangle | square | circle | ellipse | triangle | polygon | shape
 *   size: { width height }
 * }
 */
function plane( options ) {

}

/**
 * 线
 * options {
 *   angle { rotateX: 0 rotateY: 0 rotateZ: 0 }
 *   position: { x y z }
 *   length: 0
 * }
 */
function line( options ) {

}


/**
 * 点
 * options {
 *   position: { x y z }
 * }
 */
function dot( options ) {

}


/**
 * 材料
 * options {
 *   u: (frictionFactor) 0.2
 *   k: K=(F/S)/(ΔL/L)
 * }
 */
function material( options ) {

}
// 物理
// 力 force
// 重力 gravity
// 重力加速度 acceleration of gravity
// 摩擦力 friction
// 拉力 traction
// 质量 mass
// 惯量 Interia
// 加速度 acceleration
// 力矩 torque
// 静止 at rest
// 相对 relative
// 能量 energy
// 动能 kenetic energy
// 势能 potential energy
// 功 work
// 动量 momentum
// 角动量 angular momentum
// 能量守恒 energy conservation
// 保守力 conserved force
// 振动 vibration
// 振幅 amplitude
// 波 wave
// 驻波 standing wave
// 震荡 oscillation
// 相干波 coherent wave
// 干涉 interference
// 衍射 diffraction
// 轨道 obital
// 速度 velocity
// 速率 speed
// 大小 magnatitude
// 方向 direction
// 水平 horizental
// 竖直 vertical
// 相互垂直 perpendicular
// 坐标 coordinate
// 直角坐标系 cersian coordinate system
// 极坐标系 polar coordinate system
// 弹簧 spring
// 球体 sphere
// 环 loop
// 盘型 disc
// 圆柱形 cylinder
// 惯性 Inertia
// 时间 time


