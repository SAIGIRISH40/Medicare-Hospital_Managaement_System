CREATE TABLE patients (
  patient_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT,
  phone VARCHAR(15),
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (phone, name)
);


CREATE TABLE doctors (
  doctor_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  specialization TEXT,
  experience INT,
  join_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'reception', 'doctor')),
  doctor_id INT,
  status TEXT CHECK (status IN ('VALID', 'INVALID')) DEFAULT 'VALID',
  is_first_login BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE visits (
  visit_id SERIAL PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT CHECK (status IN ('Pending', 'In Consultation', 'Completed')),
  diagnosis TEXT,
  consultation_fee NUMERIC,
  medicine_fee NUMERIC,
  test_fee NUMERIC,
  total_bill NUMERIC,
  payment_status TEXT CHECK ( payment_status IN ( 'PAID','UNPAID' )) DEFAULT 'UNPAID',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);


CREATE TABLE staff (
  staff_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicines (
  medicine_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC,
  quantity INT,
  min_stock INT,
  is_valid BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tests (
  test_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC,
  is_valid BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE visit_medicines (
    visit_medicine_id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL,
    medicine_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(visit_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id),
    CONSTRAINT unique_visit_medicine UNIQUE (visit_id, medicine_id)
);

CREATE TABLE visit_tests (
    visit_test_id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL,
    test_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(visit_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(test_id),
    CONSTRAINT unique_visit_test UNIQUE (visit_id, test_id)
);