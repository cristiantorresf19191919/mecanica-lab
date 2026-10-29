import {practice} from './practice-content.mjs';
const answers = new Map();
export function renderLessonPractice(id,lang,host){
 const data=practice[id]; if(!data)return;
 const t=(en,es)=>lang==='es'?es:en;
 const section=document.createElement('section');section.className='lesson-transfer';section.dataset.lessonPractice=id;host.append(section);
 const add=(tag,text,parent=section)=>{const e=document.createElement(tag);e.textContent=text;parent.append(e);return e;};
 add('p',t('WORKED PROBLEM → TRANSFER CHALLENGE','PROBLEMA RESUELTO → RETO DE APLICACIÓN')).className='eyebrow';
 add('h3',data.title[lang]);add('p',data.scene[lang]);
 const list=add('ol','');data.steps.forEach(s=>add('li',s[lang],list));
 const field=add('fieldset','');add('legend',data.question[lang],field);
 const feedback=add('p','');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const buttons=data.options.map((option,index)=>{
 const b=add('button',option[lang],field);b.type='button';b.dataset.transferAnswer=index;
 b.onclick=()=>{answers.set(id,index);update();};return b;
 });
 function update(){const chosen=answers.get(id);buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(chosen===i)));
 feedback.textContent=chosen===undefined?'':(chosen===data.correct?'':t('Reconsider: ','Revisa: '))+data.why[chosen][lang];
 feedback.dataset.result=chosen===undefined?'':chosen===data.correct?'correct':'retry';}
 const reset=add('button',t('Try again without feedback','Intentar otra vez sin respuesta'));reset.type='button';reset.onclick=()=>{answers.delete(id);update();buttons[0].focus();};
 add('p',t('A reasoning exercise with stated assumptions. It does not change the 3D model or your completion score. Your choice stays during this visit, including language changes.','Ejercicio de razonamiento con supuestos explícitos. No modifica el modelo 3D ni tu progreso. Tu elección se conserva durante esta visita, incluso al cambiar idioma.')).className='note';
 update();
}
