const nationalities = [
    "Vietnam", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cape Verde", "Cambodia", "Cameroon",
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay",
    "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Yemen", "Zambia", "Zimbabwe"
];

const cities = [
    "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Quảng Ninh", "Khánh Hòa", "Huế", "Cần Thơ", "Phú Quốc", "Nghệ An", "Bình Định", "Hải Phòng",
    "Thanh Hóa", "Lâm Đồng", "Cà Mau", "Bà Rịa - Vũng Tàu", "Gia Lai", "Đắk Lăk", "Phú Yên", "Quảng Bình", "Quảng Nam", "Điện Biên",
    "Melbourne"
];

class Adult {
    constructor(customer_name, dob, gender, nationality, phone_number, email, id_type, id_number, country_issuing, date_expiration, address = '', receive_flight_info = 'none') {
        this.customer_name = customer_name;
        this.dob = dob;
        this.gender = gender;
        this.nationality = nationality;
        this.phone_number = phone_number;
        this.email = email;
        this.id_type = id_type;
        this.id_number = id_number;
        this.country_issuing = country_issuing;
        this.date_expiration = date_expiration;
        this.address = address || '';
        this.receive_flight_info = receive_flight_info || 'none';
    }
}

class Children {
    constructor(customer_name, dob, gender) {
        this.customer_name = customer_name;
        this.dob = dob;
        this.gender = gender;
    }
}

class Infant {
    constructor(customer_name, dob, gender, fly_with) {
        this.customer_name = customer_name;
        this.dob = dob;
        this.gender = gender;
        this.fly_with = fly_with;
    }
}

module.exports = {nationalities, cities, Adult, Children, Infant};