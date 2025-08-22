// ─── 더미 데이터(서버 연동 시 교체) ─────────────────────────
const PRODUCTS = [
  {account_id:101, name:'냥코인 입출금통장', description:'수수료 면제 & 간편 이체가 강점인 자유입출금', category:'입출금/면제', benefits:'앱 로그인', interest:0.25, type:'입출금'},
  {account_id:201, name:'정기예금', description:'고정금리 예금 상품', category:'예금/고정', benefits:'급여이체,자동이체,앱 로그인', interest:3.10, type:'예금'},
  {account_id:202, name:'청년 적금', description:'청년 전용 적금(우대 쉬움)', category:'적금/청년', benefits:'급여이체,자동이체,앱 로그인', interest:3.70, type:'적금'}
];
const USER_ACCTS = [
  {user_account_id:1, account_name:'모으냥즈 통장', account_number:'123-45-67890', balance:5321000},
  {user_account_id:2, account_name:'생활비통장', account_number:'222-33-44444', balance:785000}
];
// 우대 bp 매핑(%p)
const BONUS_MAP = new Map([
  ['급여이체',0.20], ['자동이체',0.10], ['앱 로그인',0.05]
]);

// ─── 유틸 ───────────────────────────────────────────────
const qs = new URLSearchParams(location.search);
const productId = +(qs.get('id')||201);
const product = PRODUCTS.find(p=>p.account_id===productId)||PRODUCTS[0];

const $ = s=>document.querySelector(s);
const $$ = s=>[...document.querySelectorAll(s)];
const fmtMoney = n => `${Math.round(n).toLocaleString('ko-KR')}원`;
const asPct = (n,dp=2)=> `${Number(n).toFixed(dp)}%`;
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

// 기본/최고/우대상한 산출(스키마에 base 없어서 추정)
const allBenefits = (product.benefits||'').split(',').map(s=>s.trim()).filter(Boolean);
const posBonusSum = allBenefits.map(b=>BONUS_MAP.get(b)||0).filter(v=>v>0).reduce((a,b)=>a+b,0);
const MAX = product.interest;              // 최고금리(연%)
const BASE = clamp(MAX - posBonusSum, 0, MAX);
const BONUS_CAP = MAX - BASE;

// 적합도 도넛 데모
const fit = 0.82;

// ─── 좌측 요약 세팅 ─────────────────────────────────────
$('#prodChips').innerHTML = `
  <span class="badge">${product.type}</span>
  <span class="badge">${product.category}</span>
`;
$('#prodName').textContent = product.name;
$('#prodDesc').textContent = product.description;
$('#baseRate').textContent = asPct(BASE);
$('#maxRate').textContent  = asPct(MAX);
$('#fitRing').style.setProperty('--val', fit);
$('#fitPct').textContent = Math.round(fit*100)+'%';

// ─── 1단계: 계정 선택 ───────────────────────────────────
$('#funding').innerHTML = USER_ACCTS.map(a=>
  `<option value="${a.user_account_id}">${a.account_name} · ${a.account_number} · 잔액 ${a.balance.toLocaleString()}원</option>`
).join('');

// ─── 2단계: 납입 설정(예금/적금 분기) ─────────────────────
const isSaving = product.type==='적금';
$('#savingExtra').style.display = isSaving ? '' : 'none';
$('#amountLabel').textContent = isSaving ? '월 납입액' : '예치 금액';

// 입력 요소
const elAmt = $('#amount'), elRange = $('#amountRange'), elTerm = $('#term'), elTax = $('#tax');
elAmt.value = (isSaving?300000:3000000).toLocaleString();
elRange.value = isSaving?300000:3000000;

// ─── 3단계: 우대 조건 ───────────────────────────────────
const bonusWrap = $('#bonusWrap');
const positiveBonuses = allBenefits.filter(b=>(BONUS_MAP.get(b)||0)>0);
if (positiveBonuses.length){
  bonusWrap.innerHTML = positiveBonuses.map(b=>`
    <label class="badge">
      <input type="checkbox" data-bonus="${BONUS_MAP.get(b)}"> ${b} (+${BONUS_MAP.get(b).toFixed(2)}%p)
    </label>`).join('');
}else{
  $('#noBonusHint').style.display = '';
}

// ─── 계산 로직 ──────────────────────────────────────────
function getAmount(){
  return +(elAmt.value.replace(/[^\d]/g,''))||0;
}
function gatherBonus(){
  const sum = $$('#bonusWrap input[type="checkbox"]:checked').reduce((s,el)=>s + (+el.dataset.bonus||0), 0);
  return clamp(sum, 0, BONUS_CAP);
}
function calc(){
  const P = getAmount();
  const m = +elTerm.value;
  const tax = +elTax.value;
  const bonus = gatherBonus();
  const ratePct = BASE + bonus;      // 연 % (우대 반영)
  const r = ratePct/100;             // 소수

  let gross;
  if(isSaving){
    // 월 적립식 단리 근사
    gross = P * (r/12) * (m*(m+1)/2);
  }else{
    gross = P * r * (m/12);
  }
  const net = gross * (1 - tax);        // 세후
  const total = isSaving ? (P*m + net) : (P + net);
  // APY(연환산)
  const apy = isSaving ? ((gross/(P*m))*12*100) : ((gross/P)/(m/12)*100);

  // 좌측 요약 갱신
  $('#appliedRate').textContent = asPct(ratePct,2);
  $('#preInt').textContent = fmtMoney(gross);
  $('#postInt').textContent = fmtMoney(net);
  $('#maturity').textContent = fmtMoney(total);
  $('#appliedLine').textContent =
    `적용 금리: ${asPct(ratePct,2)} · 우대 합산 +${bonus.toFixed(2)}%p (최대 ${(BONUS_CAP).toFixed(2)}%p)`;

  // 4단계 요약용
  $('#sumAmount').textContent = (isSaving?'월 납입액: ':'예치금: ') + fmtMoney(P);
  $('#sumTerm').textContent   = m+'개월';
  $('#sumRate').textContent   = asPct(ratePct,2);
}
function syncAmount(e){
  if(e?.target===elRange){
    elAmt.value = (+elRange.value).toLocaleString();
  }else if(e?.target===elAmt){
    const v = getAmount(); elRange.value = v;
    elAmt.value = v.toLocaleString();
  }
  calc();
}
elRange.addEventListener('input', syncAmount);
elAmt.addEventListener('input', syncAmount);
[elTerm, elTax].forEach(el=>el.addEventListener('change', calc));
bonusWrap.addEventListener('change', calc);
calc();

// ─── 단계 내비게이션 ───────────────────────────────────
let step = 1;
const goto = n=>{
  step = n;
  $$('.section').forEach(s=>s.classList.toggle('is-on', +s.dataset.step===step));
  $$('#stepper .step').forEach((s,i)=>s.classList.toggle('is-on', i===step-1));
  // 4단계 진입 시 요약 채우기
  if(step===4){
    const fSel = $('#funding');
    $('#sumFunding').textContent = fSel.options[fSel.selectedIndex].textContent;
  }
};
$('#next1').onclick = ()=>goto(2);
$('#prev2').onclick = ()=>goto(1);
$('#next2').onclick = ()=>goto(3);
$('#prev3').onclick = ()=>goto(2);
$('#next3').onclick = ()=>{
  if(!$('#consent1').checked || !$('#consent2').checked){
    alert('필수 약관에 동의해 주세요.'); return;
  }
  goto(4);
};
$('#prev4').onclick = ()=>goto(3);

// ─── 제출(예시) ─────────────────────────────────────────
$('#submitBtn').onclick = async()=>{
  // 유효성 간단 체크
  if(getAmount()<=0){ alert('금액을 확인해 주세요.'); return; }

  const payload = {
    product_id: product.account_id,
    product_type: product.type, // "예금"/"적금"/"입출금"
    funding_user_account_id: +$('#funding').value,
    open_new_account: $('#openNew').value==='yes',
    amount: getAmount(),
    term_months: +$('#term').value,
    tax_rate: +$('#tax').value,
    autopay_day: isSaving ? $('#autopayDay').value : null,
    maturity_option: $('#maturityOp').value || null,
    selected_bonuses: $$('#bonusWrap input:checked').map(el=>({label:el.parentElement.textContent.trim(), bp:+el.dataset.bonus})),
    consents: {terms:$('#consent1').checked, privacy:$('#consent2').checked, marketing:$('#consent3').checked}
  };

  console.log('POST /api/apply payload', payload);
  // TODO: 실제 서버:
  // await fetch('/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
  alert('가입 신청이 접수되었습니다! (콘솔에서 payload 확인)');
};