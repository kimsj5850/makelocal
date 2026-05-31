insert into suppliers (
  company_name,
  region,
  address,
  main_processes,
  machines,
  materials,
  small_batch_available,
  post_processing_available,
  average_lead_time,
  description,
  admin_memo,
  is_active
) values
(
  '대구 정밀가공 샘플',
  '대구',
  '대구 3공단',
  array['MCT', 'CNC', '밀링'],
  array['MCT 3축', '범용 밀링'],
  array['알루미늄', '스틸', '스테인리스'],
  true,
  true,
  '영업일 기준 7~14일',
  '시제품 소량 가공 대응 가능 업체 샘플 데이터',
  '초기 개발용 seed 데이터입니다.',
  true
),
(
  '경북 판금제작 샘플',
  '경북',
  '경북 산업단지',
  array['판금', '레이저 절단', '용접'],
  array['레이저 절단기', '절곡기', 'CO2 용접기'],
  array['스틸', '스테인리스', '알루미늄'],
  true,
  false,
  '영업일 기준 10~20일',
  '판금 및 용접 시제품 대응 가능 업체 샘플 데이터',
  '초기 개발용 seed 데이터입니다.',
  true
);
