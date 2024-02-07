class HospitalStore {
  constructor(hospitals) {
    this.hospitals = hospitals;
  }

  sliced(n) {
    return new HospitalStore(this.hospitals.slice(0, n));
  }

  sortedByDistance() {
    return new HospitalStore(
      this.hospitals.sort(function (a, b) {
        return a.distance - b.distance;
      }),
    );
  }

  filtered(text) {
    if (text.length === 0) {
      return this;
    }
    return new HospitalStore(
      this.hospitals.filter((h) => h.name.includes(text)),
    );
  }

  distanceFilter(x, y, range) {
    return new HospitalStore(
      this.hospitals
        .map(function (h) {
          const hospital = Object.assign({}, h);
          hospital.distance = calculateDistance(x, y, h.x, h.y);
          return hospital;
        })
        .filter(function (h) {
          return h.distance <= range;
        }),
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
    icon,
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
    // アイコン ("N/A","worse","consistent","better")
    this.grade = Grade.from(icon);

    this.grade_notice =
      this.frozen_egg == 0 || this.frozen_egg >= 60
        ? null
        : this.frozen_egg < 30
        ? "データ数が極めて少なく、統計的な不確かさが大きい"
        : "データ数が少なく、統計的な不確かさがやや大きい";
  }
}

class Grade {
  static names = {
    worse: "worse_than_ave",
    consistent: "consistent_with",
    better: "better_than_ave",
    notPublic: "not_public",
  };

  static from(icon) {
    switch (icon) {
      case "worse":
        return new Grade(Grade.names.worse);
      case "consistent":
        return new Grade(Grade.names.consistent);
      case "better":
        return new Grade(Grade.names.better);
      default:
        return new Grade(Grade.names.notPublic);
    }
  }

  constructor(name) {
    this.name = name;
  }

  get iconPath() {
    return `images/icons/${this.name}.svg`;
  }

  get label() {
    switch (this.name) {
      case Grade.names.worse:
        return "全国平均より低い";
      case Grade.names.consistent:
        return "全国平均と同等";
      case Grade.names.better:
        return "全国平均より高い";
      default:
        return "データが非公開";
    }
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
