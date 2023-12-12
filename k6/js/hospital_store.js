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
      this.hospitals.filter((h) => h.name.includes(text) || h.address.includes(text)),
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
  ) {
    this.name = name;
    this.address = address;
    this.prefecture = prefecture;
    this.phone = phone;
    this.flag1 = flag1;
    this.flag2 = flag2;
    this.flag3 = flag3;
    this.flag4 = flag4;
    this.flag5 = flag5;
    this.flag6 = flag6;
    this.flat7 = flat7;
    this.flag8 = flag8;
    this.frozen_egg = frozen_egg;
    this.frozen_preg = frozen_preg;
    this.frozen_birth = frozen_birth;
    this.frozen_rate = frozen_rate;
  }
}
