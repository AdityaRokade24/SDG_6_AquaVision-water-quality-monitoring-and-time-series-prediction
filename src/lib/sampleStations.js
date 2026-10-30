// ==========================================================
// Prayagraj Triveni Sangam Specialized Monitoring Sectors
// Confluence of Ganga, Yamuna & Mythical Saraswati
// ==========================================================

export const SANGAM_SECTORS = [
  {
    id: 'sangam-central',
    name: 'Triveni Sangam Confluence (Central Buoy #01)',
    reach: 'Primary Sacred Bathing Zone (Confluence of Ganga & Yamuna)',
    coordinates: '25.4358° N, 81.8463° E',
    status: 'Online',
    presetData: {
      ph: 7.42,
      do_level: 7.6,
      temperature: 22.4,
      conductivity: 385,
      orp: 288,
      turbidity: 7.8,
      bod: 2.6
    },
    notes: 'Primary pilgrimage confluence point; high aeration from mixed river currents.'
  },
  {
    id: 'sangam-yamuna',
    name: 'Yamuna Influx Reach (Sangam South Buoy)',
    reach: 'Yamuna River Convergence Channel',
    coordinates: '25.4290° N, 81.8510° E',
    status: 'Online',
    presetData: {
      ph: 7.65,
      do_level: 6.8,
      temperature: 23.2,
      conductivity: 440,
      orp: 260,
      turbidity: 9.5,
      bod: 3.2
    },
    notes: 'Yamuna deep water channel entering Sangam confluence.'
  },
  {
    id: 'sangam-ganga-north',
    name: 'Ganga Upstream Inflow (Sangam North Buoy)',
    reach: 'Ganga River Pristine Entry Approach',
    coordinates: '25.4415° N, 81.8420° E',
    status: 'Online',
    presetData: {
      ph: 7.35,
      do_level: 8.1,
      temperature: 21.6,
      conductivity: 345,
      orp: 315,
      turbidity: 6.2,
      bod: 2.1
    },
    notes: 'Upper Ganga flow entering Prayagraj floodplain; high dissolved oxygen.'
  },
  {
    id: 'sangam-snan-ghat',
    name: 'Kila Ghat / Saraswati Ghat Snan Sector',
    reach: 'Near Allahabad Fort & Pilgrim Ghat Steps',
    coordinates: '25.4318° N, 81.8480° E',
    status: 'Online',
    presetData: {
      ph: 7.50,
      do_level: 7.1,
      temperature: 22.8,
      conductivity: 410,
      orp: 275,
      turbidity: 11.2,
      bod: 3.5
    },
    notes: 'High pilgrim immersion and sacred bathing activity zone.'
  }
];

export const GANGA_STATIONS = SANGAM_SECTORS;

