import assert from 'node:assert/strict';
import {adaptiveLevel,progressComparison,adaptPrediction} from '../dist/machines/prediction-adaptive.mjs';
import {buildComparison} from '../dist/machines/comparison-model.mjs';
import {predictionEvents,predictionAnswer} from '../dist/machines/prediction-model.mjs';
const row=(points,review=false)=>({signal:'q',label:'YA',resolved:true,points,review,errors:points===100?0:1,hints:0,revealed:false});
assert.equal(adaptiveLevel([row(100),row(100)],'q'),'support');
assert.equal(adaptiveLevel([row(70),row(70),row(70)],'q'),'practice');
const high=[row(100),row(100),row(100)];assert.equal(adaptiveLevel(high,'q'),'advanced');assert.equal(adaptiveLevel([...high,...Array.from({length:5},()=>row(0))],'q'),'support');
const stats=progressComparison([row(20),row(40),row(90,true),row(100,true),{...row(0,true),resolved:false}])[0];assert.equal(stats.first,30);assert.equal(stats.review,95);assert.equal(stats.delta,65);assert.equal(stats.reviewCount,2);assert.equal(progressComparison([row(0)])[0].review,null);
const e=predictionEvents(buildComparison())[0];for(const [rows,count]of [[[],2],[[row(70),row(70),row(70)],4],[high,6]]){const adapted=adaptPrediction(e,rows);assert.equal(adapted.options.length,count);const game={events:[adapted],at:0,phase:'question',attempts:0,hints:0,results:[]};assert(predictionAnswer(game,adapted.correctId||adapted.answer.id));}
const advanced=adaptPrediction(e,high),g={events:[advanced],at:0,phase:'question',attempts:0,hints:0,results:[]};assert.equal(predictionAnswer(g,advanced.answer.id+':1-0'),false);
console.log('PASS cohort counts/missing data, adaptive thresholds, downgrade, directional scoring and all option levels.');
