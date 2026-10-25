export function replaySample(trace,index){const t=trace[index];if(!t?.snapshot)return null;return {sample:structuredClone(t),model:structuredClone(t.snapshot)};}
export function oppositeSample(trace,index){const t=trace[index];if(!t)return -1;let best=-1;for(let i=0;i<trace.length;i++){const c=trace[i];if(c.snapshot&&c.gear===t.gear&&c.revision===t.revision&&c.direction===-t.direction&&(best<0||Math.abs(i-index)<Math.abs(best-index)))best=i;}return best;}

export function cableComparison(snapshot){if(!snapshot?.healthy)return null;return {actual:structuredClone(snapshot),healthy:structuredClone(snapshot.healthy),delta:snapshot.position-snapshot.healthy.position};}
