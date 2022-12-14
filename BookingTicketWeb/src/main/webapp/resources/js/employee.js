/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global fetch */

const form = document.getElementById("submitFormEmployee");
const formEmployee = document.getElementById("formEmployee");
const formUser = document.getElementById("formUser");
let userId;

let dateOfBirth = document.getElementById('dateOfBirth');
let username = document.getElementById('username');
let name = document.getElementById('name');
let email = document.getElementById('email');
let address = document.getElementById('address');
let phoneInput = document.getElementById('phone');
let cmndInput = document.getElementById('identityCard');
let passwordInput = document.getElementById('password');
let confirmPasswordInput = document.getElementById('confirmPassword');

let textValidatePass = document.getElementById('invalid-feedback-password');
let textValidateCFPass = document.getElementById('invalid-feedback-cfpassword');
let textValidatePhone = document.getElementById('invalid-feedback-phone');
let textValidateCMND = document.getElementById('invalid-feedback-cmnd');
let textValidateName = document.getElementById('invalid-feedback-name');
let textValidateEmail = document.getElementById('invalid-feedback-email');
let textValidateAd = document.getElementById('invalid-feedback-ad');
let textValidateUName = document.getElementById('invalid-feedback-uname');

const isValidEmail = email => /^[A-Za-z0-9+_.-]+@(.+)$/.test(email);

const isValidPhone = phone =>
    /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g.test(phone);

const isValidCMND = id => /^\d{9}$/.test(id) || /^\d{12}$/.test(id);

if (dateOfBirth) {
    const currentDate = new Date();
    let year = currentDate.getFullYear() - 18;
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();

    if (month < 10) {
        month = `0${month}`;
    }
    if (date < 10) {
        date = `0${date}`;
    }

    dateOfBirth.setAttribute('max', `${year}-${month}-${date}`);
}

const handleValidateForm = (event, inputType) => {
    switch (inputType) {
        case 'name':
            if (event.target.value.length === 0) {
                event.target.classList.add('is-invalid');
                textValidateName.textContent = 'B???n ph???i ??i???n t??n nh??n vi??n!!!';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
        case 'email':
            if (!isValidEmail(event.target.value)) {
                event.target.classList.add('is-invalid');
                textValidateEmail.textContent = 'Email b???n ??i???n kh??ng h???p l???, ph???i ch???a k?? t??? @';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
        case 'address':
            if (event.target.value.length === 0) {
                event.target.classList.add('is-invalid');
                textValidateAd.textContent = 'B???n ph???i ??i???n ?????a ch???!!!';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
        case 'username':
            if (event.target.value.length === 0) {
                event.target.classList.add('is-invalid');
                textValidateUName.textContent = 'B???n ph???i ??i???n t??n ????ng nh???p!!!';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
        case 'phone':
            if (!isValidPhone(event.target.value)) {
                event.target.classList.add('is-invalid');
                textValidatePhone.textContent = 'S??? ??i???n tho???i b???n nh???p kh??ng h???p l???!';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
        case 'cmnd':
            if (!isValidCMND(event.target.value)) {
                event.target.classList.add('is-invalid');
                textValidateCMND.textContent = 'S??? CMND/CCCD b???n nh???p kh??ng h???p l???!';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
        case 'password':
        case 'confirmPassword':
            if (event.target.value.length < 3) {
                event.target.classList.add('is-invalid');
                textValidatePass.textContent = 'M???t kh???u ph???i tr??n 2 k?? t???!!!';
            } else if (event.target.value !== passwordInput.value &&
                    inputType === 'confirmPassword') {
                event.target.classList.add('is-invalid');
                textValidateCFPass.textContent = 'M???t kh???u kh??ng tr??ng kh???p!';
            } else {
                event.target.classList.remove('is-invalid');
            }
            break;
    }
};

phoneInput.addEventListener('change', (event) => handleValidateForm(event, 'phone'));

cmndInput.addEventListener('change', (event) => handleValidateForm(event, 'cmnd'));

passwordInput.addEventListener('change', (event) => handleValidateForm(event, 'password'));

confirmPasswordInput.addEventListener('change', (event) => handleValidateForm(event, 'confirmPassword'));

name.addEventListener('change', (event) => handleValidateForm(event, 'name'));

email.addEventListener('change', (event) => handleValidateForm(event, 'email'));

address.addEventListener('change', (event) => handleValidateForm(event, 'address'));

username.addEventListener('change', (event) => handleValidateForm(event, 'username'));

function submitUserEmployee() {
    event.preventDefault();
    console.log(form.checkValidity());
    const data = new FormData();
    const file = document.getElementById('upload_avatar').files[0];
    data.append("file", file);
    data.append("upload_preset", "upload_for_web");
    if (form.checkValidity()) {
        fetch('https://api.cloudinary.com/v1_1/dvsqhstsi/upload', {
            method: "post",
            body: data
        }).then((res) => {
            if (res.ok) {
                resCopy = res.clone();
                console.log(res); //first consume it in console.log
                return res.json(); //then consume it again, the error happens
            }
        }).then((data) => {
            if (data && data.secure_url) {
                console.dir(form.elements.address.value);
                return fetch("/BookingTicketWeb/api/admin/add-user-epl", {
                    method: 'post',
                    body: JSON.stringify({
                        "name": form.elements.name.value,
                        "username": form.elements.username.value,
                        "password": form.elements.password.value,
                        "confirmPassword": form.elements.confirmPassword.value,
                        "email": form.elements.email.value,
                        "phone": form.elements.phone.value,
                        "userrole": form.elements.userrole.value,
                        "avt": data.secure_url
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                throw Error("C?? l???i x???y ra, vui l??ng quay l???i sau!!");
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            if (data && data.id > 0) {
                userId = data.id;
                return fetch("/BookingTicketWeb/api/admin/add-employee", {
                    method: 'post',
                    body: JSON.stringify({
                        "userIdEmployee": userId,
                        "identityCard": form.elements.identityCard.value,
                        "address": form.elements.address.value,
                        "dateOfBirth": form.elements.dateOfBirth.value,
                        "gender": form.elements.gender.value
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                throw Error("C?? l???i x???y ra, vui l??ng quay l???i sau!!");
            }
        }).then((res) => {
            return res.json();
        }).then(data => {
            if (data) {
                alert('Th??m nh??n vi??n th??nh c??ng!');
                document.location.href = "/BookingTicketWeb/admin/employees/list";
            } else {
                throw Error("C?? l???i x???y ra, vui l??ng quay l???i sau!!");
            }
        }).catch((error) => {
            const errEle = document.getElementById('error-message');
            errEle.textContent = "C?? l???i x???y ra, vui l??ng th??? l???i l???n n???a!!";
            console.error(error);
        });
    }
}

function updateEmployee() {
    event.preventDefault();
    console.log(formUser.checkValidity());
    console.log(formEmployee.checkValidity());
    if (formUser.checkValidity() && formEmployee.checkValidity()) {
        fetch("/BookingTicketWeb/api/admin/update-user-employee", {
            method: 'put',
            body: JSON.stringify({
                "userIdEmployee": formUser.elements.id.value,
                "name": formUser.elements.name.value,
                "email": formUser.elements.email.value,
                "phone": formUser.elements.phone.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((code) => {
            return console.log(code);
        }).then(() => {
            return fetch("/BookingTicketWeb/api/admin/update-employee", {
                method: 'put',
                body: JSON.stringify({
                    "userIdEmployee": formUser.elements.id.value,
                    "identityCard": formEmployee.elements.identityCard.value,
                    "address": formEmployee.elements.address.value,
                    "dateOfBirth": formEmployee.elements.dateOfBirth.value,
                    "gender": formEmployee.elements.gender.value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }).then((code) => {
            return console.log(code);
        }).then(() => {
            alert('Thay ?????i th??ng tin nh??n vi??n th??nh c??ng!');
            document.location.href = "/BookingTicketWeb/admin/employees/list";
        }).catch((error) => {
            const errEle = document.getElementById('error-message');
            errEle.textContent = "C?? l???i x???y ra, vui l??ng th??? l???i l???n n???a!!";
            console.error(error);
        });
    }
}

