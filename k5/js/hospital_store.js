class HospitalStore {
  constructor(hospitals) {
    this.hospitals = hospitals;
  }

  sliced(n) {
    return new HospitalStore(this.hospitals.slice(0, n));
  }

  filtered(areas) {
    if (areas.length === 0) {
      return this;
    }
    return new HospitalStore(
      this.hospitals.filter((h) =>
        areas.some((area) => h.address.includes(area)),
      ),
    );
  }

  filteredByName(names) {
    if (names.length === 0) {
      return this;
    }
    return new HospitalStore(
      this.hospitals.filter((h) => names.includes(h.name)),
    );
  }

  sorted(order) {
    const sorted = [...this.hospitals].sort((a, b) => {
      if (a[order] < b[order]) {
        return 1;
      } else if (a[order] > b[order]) {
        return -1;
      } else {
        return 0;
      }
    });

    return new HospitalStore(sorted);
  }

  hospitalWithKey(key) {
    return this.hospitals.find((h) => h.graphName() === key);
  }

  getHospitalNames() {
    return this.hospitals.map((h) => h.name);
  }

  getHospitalNamesWithAddress() {
    return this.hospitals.map((h) => h.graphName());
  }

  getEtCount() {
    return this.hospitals.map((h) => h.et_count);
  }

  getPregCount() {
    return this.hospitals.map((h) => h.preg_count);
  }

  getBirthCount() {
    return this.hospitals.map((h) => h.birth_count);
  }

  getBirthRatio() {
    return this.hospitals.map((h) => h.birth_ratio);
  }

  countByArea(area) {
    return this.hospitals.filter((h) => h.address.includes(area)).length;
  }
}

class Hospital {
  constructor(name, et_count, preg_count, birth_count, birth_ratio, address) {
    this.name = name;
    this.et_count = et_count;
    this.preg_count = preg_count;
    this.birth_count = birth_count;
    this.birth_ratio = birth_ratio;
    this.address = address;

    this.prefecture = this.address.replace(/^(.+?[都道府県]).*/g, "$1");
    this.city = this.address.replace(
      /^(.+?[都道府県])?(.+?[市区町村]).*/g,
      "$2",
    );
  }

  shortAddress() {
    return this.prefecture + this.city;
  }

  graphName() {
    return this.shortAddress() + "：" + this.name;
  }
}
