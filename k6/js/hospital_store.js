class HospitalStore {
  constructor(hospitals) {
    this.hospitals = hospitals;
  }

  sliced(n) {
    return new HospitalStore(this.hospitals.slice(0, n));
  }

  filtered(text) {
    if (text.length === 0) {
      return this;
    }
    return new HospitalStore(
      this.hospitals.filter(
        (h) => h.name.includes(text) || h.address.includes(text),
      ),
    );
  }
}

class Hospital {
  constructor(
    name,
    address,
    prefecture,
    phone,
    flag1,
    flag2,
    flag3,
    flag4,
    flag5,
    flag6,
    flat7,
    flag8,
    frozen_egg,
    frozen_preg,
    frozen_birth,
    frozen_rate,
    url,
  ) {
    // 病院名
    this.name = name;
    // 住所
    this.address = address;
    // 都道府県
    this.prefecture = prefecture;
    // 電話番号
    this.phone = phone;
    // 人工授精
    this.flag1 = flag1;
    // 採卵術
    this.flag2 = flag2;
    // 体外受精
    this.flag3 = flag3;
    // 顕微授精
    this.flag4 = flag4;
    // 新鮮胚移植
    this.flag5 = flag5;
    // 凍結・融解胚移植
    this.flag6 = flag6;
    // 精巣内精子採取術
    this.flat7 = flat7;
    // 顕微鏡下精巣内精子採取術
    this.flag8 = flag8;
    // 採卵総回数（回）
    this.frozen_egg = frozen_egg;
    // 妊娠数（回）
    this.frozen_preg = frozen_preg;
    // 生産分娩数（回）
    this.frozen_birth = frozen_birth;
    // 移植あたり生産率（%）
    this.frozen_rate = frozen_rate;
    // URL
    this.url = url;
  }
}
