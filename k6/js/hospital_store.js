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

  distanceFilter(x, y, range) {
    return new HospitalStore(
      this.hospitals.filter((h) => calculateDistance(x, y, h.x, h.y) <= range),
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
    x,
    y,
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
    // 緯度
    this.x = x;
    // 経度
    this.y = y;
  }
}

const R = Math.PI / 180;

function calculateDistance(lat1, lng1, lat2, lng2) {
  lat1 *= R;
  lng1 *= R;
  lat2 *= R;
  lng2 *= R;
  return (
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2),
    )
  );
}
