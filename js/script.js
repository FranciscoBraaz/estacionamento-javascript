class Parking {
    constructor(){
        this.list = [];
        this.indexBtnEdit = 0;
        this.initListStorage();
    }

    addCar() {
        let date = new Date();
        let model = document.querySelector('#modelCar-input').value;
        let licensePlate = document.querySelector('#licensePlate-input').value;
        let hourEntry = date.toLocaleTimeString('pt-BR');
        let hourEntryConvert = date.getTime();

        this.list.push({model: model, licensePlate: licensePlate, hour: hourEntry, hourMilliseconds: hourEntryConvert});
        this.resetInputs();
        this.setTable(this.list);
        this.addActions();
        this.saveListLocalStorage();
    }

    addActions(){
        let removeBtns = document.querySelectorAll('.btn-trash');
        let removeBtn = removeBtns[removeBtns.length - 1];
        let editBtns = document.querySelectorAll('.btn-edit');
        let editBtn = editBtns[editBtns.length - 1];

        let referenceParking = this;

        removeBtn.addEventListener('click', function() {
            let btnsTrash = document.querySelectorAll('.btn-trash');
            let indexBtn = Array.from(btnsTrash).indexOf(this);
            referenceParking.removeCars(this, indexBtn);
        });

        editBtn.addEventListener('click', function() {
            let btnsEdit = document.querySelectorAll('.btn-edit');
            let indexBtn = Array.from(btnsEdit).indexOf(this);
            referenceParking.setEdit(indexBtn);
        });
    }

    removeCars(btn, indexBtn) {
        this.exitCar(indexBtn);
        let parentEl = btn.parentElement;
        parentEl.parentElement.remove();
        this.list.splice(indexBtn-1, 1);
        this.saveListLocalStorage();
    }

    setEdit(indexBtn) {
        let model = this.list[indexBtn - 1].model;
        let licensePlate = this.list[indexBtn - 1].licensePlate;
        document.querySelector('#modelCar-input').value = model;
        document.querySelector('#licensePlate-input').value = licensePlate;
        document.querySelector('.btnConfirm').classList.add('hide');
        document.querySelector('.btnUpdate').classList.remove('hide');
        document.querySelector('.btnCancel').classList.remove('hide');
        this.indexBtnEdit = indexBtn;
    }

    editCars(indexCar) {
        let model = document.querySelector('#modelCar-input').value;
        let licensePlate = document.querySelector('#licensePlate-input').value;
        this.list[indexCar - 1].model = model;
        this.list[indexCar - 1].licensePlate = licensePlate;
        this.updateTable(indexCar);
        this.saveListLocalStorage();
    }

    resetInputs() {
        document.querySelector('#modelCar-input').value = '';
        document.querySelector('#licensePlate-input').value = '';
    }

    hideButtonsUpdate() {
        document.querySelector('.btnConfirm').classList.remove('hide');
        document.querySelector('.btnUpdate').classList.add('hide');
        document.querySelector('.btnCancel').classList.add('hide');
    }

    cancel() {
        document.querySelector('#modelCar-input').value = '';
        document.querySelector('#licensePlate-input').value = '';
        this.hideButtonsUpdate();
    }

    updateTable(indexCar) {
        this.resetInputs();
        this.hideButtonsUpdate();
        let model = this.list[indexCar - 1].model;
        let licensePlate = this.list[indexCar - 1].licensePlate;
        let template = document.querySelectorAll('.template');
        template[indexCar].querySelector('.model').innerHTML = model;
        template[indexCar].querySelector('.licensePlate').innerHTML = licensePlate;
    }

    setTable(list) {
        let bodyTable = document.querySelector('.table tbody');
        let template = document.querySelector('.template').cloneNode(true);
        let model = list[list.length - 1].model;
        let licensePlate = list[list.length - 1].licensePlate;
        let hourEntry = list[list.length - 1].hour;

        template.querySelector('.model').innerHTML = model;
        template.querySelector('.licensePlate').innerHTML = licensePlate;
        template.querySelector('.hourEntry').innerHTML = hourEntry;
        template.classList.remove('hide');
        bodyTable.appendChild(template);
    }

    exitCar(indexCar){
        let date = new Date();
        let hourExit = document.querySelector('.modal-body > p > span');
        hourExit.textContent = date.toLocaleTimeString('pt-BR');
        let duration = date.getTime() - this.list[indexCar-1].hourMilliseconds;
        let totalPay = Math.ceil((duration / (1000 * 60 * 60)) % 24) * 5;
        
        let pay = document.querySelector('.totalPay > span');
        
        pay.textContent = `R$ ${totalPay},00`;
    }

    saveListLocalStorage(){
        let listJson = JSON.stringify(this.list);
        localStorage.setItem('list', listJson);
    }

    initListStorage() {
        let listStorage = localStorage.getItem('list');
        if(listStorage) {
            this.list = JSON.parse(listStorage);
            this.list.forEach((car, index) => {
                this.setInitTable(index);
                this.addActions();
            })
        }   
    }

    setInitTable(index) {
        let bodyTable = document.querySelector('.table tbody');
        let template = document.querySelector('.template').cloneNode(true);
        let model = this.list[index].model;
        let licensePlate = this.list[index].licensePlate;
        let hourEntry = this.list[index].hour;

        template.querySelector('.model').innerHTML = model;
        template.querySelector('.licensePlate').innerHTML = licensePlate;
        template.querySelector('.hourEntry').innerHTML = hourEntry;
        template.classList.remove('hide');
        bodyTable.appendChild(template);
    }

    removeAll() {
        location.reload();
        localStorage.clear()
    }
}

function init() {
    let parking = new Parking();

    let btnAdd = document.querySelector('.btnConfirm');
    let btnUpdate = document.querySelector('.btnUpdate');
    let btnCancel = document.querySelector('.btnCancel');
    let btnRemoveAll = document.querySelector('.btnRemoveAll');
    let model = document.querySelector('#modelCar-input');
    let licensePlate = document.querySelector('#licensePlate-input');

    btnAdd.addEventListener('click', function(e){
        e.preventDefault();
        if(model.value === '') {
            alert('Insira um modelo')
        } else if (licensePlate.value === '') {
            alert('Insira uma placa');
        } else { 
            parking.addCar();
        }
    });

    btnUpdate.addEventListener('click', function(e){
        e.preventDefault();
        if(model.value === '') {
            alert('Insira um modelo')
        } else if (licensePlate.value === '') {
            alert('Insira uma placa');
        } else { 
            parking.editCars(parking.indexBtnEdit);
        }
    });

    btnCancel.addEventListener('click', function(e){
        e.preventDefault();
        parking.cancel();
    });

    btnRemoveAll.addEventListener('click', function(e){
        if(confirm("Tem certeza que deseja deletar todos os dados?")){
            e.preventDefault();
            parking.removeAll();
        }
    });
}
init();
