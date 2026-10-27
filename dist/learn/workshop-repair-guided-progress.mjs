// Keep sessions as independent evidence: repeated clicks cannot unlock a level.
export function interventionProgress(rows,kind,id){
 const sessions=rows.filter(g=>g.user.kind===kind&&g.rounds.some(r=>r.id===id));
 const summarize=gs=>{const decisions=gs.flatMap(g=>g.rounds.filter(r=>r.id===id));return {sessions:gs.length,total:decisions.length,correct:decisions.filter(r=>r.useful).length,hints:decisions.filter(r=>r.hint).length,percent:decisions.length?Math.round(100*decisions.filter(r=>r.useful).length/decisions.length):null};};
 const isReview=g=>g.source==='review'||Boolean(g.focus);
 return {first:summarize(sessions.filter(g=>!isReview(g)).slice(0,3)),reviews:summarize(sessions.filter(isReview).slice(-3)),sessions};
}
export function guidedReviewPlan(rows,kind,id){
 const {sessions}=interventionProgress(rows,kind,id),recent=sessions.slice(-3);
 const strong=g=>g.rounds.filter(r=>r.id===id).every(r=>r.useful&&!r.hint);
 const ready=recent.length===3&&recent.every(strong);
 const advanced=recent.length===3&&recent.every(g=>g.user.fault==='combined'||g.user.fault.startsWith('intermittent-'));
 const level=ready?(advanced?3:2):1;
 return {level,fault:level===3?'intermittent-'+id:level===2?'combined':id,evidence:recent.length,clean:recent.filter(strong).length};
}
