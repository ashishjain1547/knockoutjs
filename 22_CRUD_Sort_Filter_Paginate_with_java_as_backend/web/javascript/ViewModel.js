var ViewModel = function(){
    var self = Parentself = this;
    
    this.isEditClicked = ko.observable(false); //To identify if edit action is to be performed on click of edit button
    
    this.inID = ko.observable();
    this.inName = ko.observable();
    this.inContactName = ko.observable();
    this.inAddress = ko.observable();
    this.inCity = ko.observable();
    this.inPostalCode = ko.observable();
    this.inCountry = ko.observable();
    
    this.tableDataList = ko.observableArray();
    this.FilterTblGridArr = ko.observableArray();
    
    this.tableDataItemViewModel = function(item){
        var self = this;
        this.customerid = ko.observable(item.id);
        this.customername = ko.observable(item.name);
        this.contactname = ko.observable(item.contactname);
        this.address = ko.observable(item.address);
        this.city = ko.observable(item.city);
        this.postalcode = ko.observable(item.postalcode);
        this.country = ko.observable(item.country);
        
        this.deleteRecord = function(item){
            var postData = {
                "id": item.customerid()
            };

            $.post("DeleteCustomerData", postData, function(result){
                var outdata = JSON.parse(result);
                if(outdata.OUT_MESSAGE === 2){
                    alert("Success!");
                    Parentself.tableDataList.remove(item);
                }
                else{
                    alert("Exception occured. RESULT: " + result);
                }
            });
        };
        
        this.editRecord = function(item){
            Parentself.inID(item.customerid());
            Parentself.inName(item.customername());
            Parentself.inContactName(item.contactname());
            Parentself.inAddress(item.address());
            Parentself.isEditClicked(true);
        };
    };
    
    this.applyData = function(){
        $.ajax({url: "LoadTableData", success: function(result){
            self.tableDataList(jQuery.map(JSON.parse(result), function (item) {
                return new self.tableDataItemViewModel(item);
            }));
            
            self.FilterTblGridArr(self.tableDataList());
        }});
    };
    
    this.submitCustomerData = function(){
        if(typeof(self.inID()) === "undefined" || self.inID() === ""){
            alert("Please enter ID.");
            return false;
        }
        if(typeof(self.inName()) === "undefined" || self.inName() === ""){
            alert("Please enter Name.");
            return false;
        }
        if(typeof(self.inContactName()) === "undefined" || self.inContactName() === ""){
            alert("Please enter Contact Name.");
            return false;
        }
        if(typeof(self.inAddress()) === "undefined" || self.inAddress() === ""){
            alert("Please enter Contact Name.");
            return false;
        }
        
        var postData = {
            "id": self.inID(),
            "name": self.inName(),
            "contactname": self.inContactName(),
            "address": self.inAddress(),
            "city": "",
            "postalcode": "",
            "country": "",
            "dbaction": (self.isEditClicked() ? "Update" : "Insert")
        };
        
        $.post("SaveCustomerData", postData, function(result){
            var outdata = JSON.parse(result);
            if(outdata.OUT_MESSAGE === 1){
                alert("Insert Successful!");
                var item = new self.tableDataItemViewModel(postData);
                self.tableDataList.push(item);
            }
            else if(outdata.OUT_MESSAGE === 3){
                var data = ko.utils.arrayFirst(self.tableDataList(), function (item) {
                    return item.customerid() === postData["id"];
                });
                alert("Update successful for customer ID: " 
                    + data.customerid());
                
                //Setting into the table view
                data.customername(postData["name"]);
                data.contactname(postData["contactname"]);
                data.address(postData["address"]);
                
                //Reseting input values
                self.isEditClicked(false);
                self.inID("");
                self.inName("");
                self.inContactName("");
                self.inAddress("");
            }
            else{
                alert("Exception occured. RESULT: " + result);
            }
        });
    };
    
    this.isIDSortingOrder = ko.observable(true);
    this.idSorting = function(){
        var data = self.tableDataList();
        if (self.isIDSortingOrder()) {
            data.sort(function (a, b) {
                var aID = a.customerid();
                var bID = b.customerid();
                return (aID === bID) ? 0 : (aID > bID) ? 1 : -1;
            });
            self.isIDSortingOrder(false);
        } else {
            data.sort(function (a, b) {
                var aID = a.customerid();
                var bID = b.customerid();
                return (aID === bID) ? 0 : (aID > bID) ? -1 : 1;
            });
            self.isIDSortingOrder(true);
        }
        self.tableDataList(data);
    };
    
    this.isNameSortingOrder = ko.observable(true);
    this.nameSorting = function(){
        var data = self.tableDataList();
        if (self.isNameSortingOrder()) {
            data.sort(function (a, b) {
                var aID = a.customername();
                var bID = b.customername();
                return (aID.toLowerCase() === bID.toLowerCase()) ? 0 : (aID.toLowerCase() > bID.toLowerCase()) ? 1 : -1;
            });
            self.isNameSortingOrder(false);
        } else {
            data.sort(function (a, b) {
                var aID = a.customername();
                var bID = b.customername();
                return (aID.toLowerCase() === bID.toLowerCase()) ? 0 : (aID.toLowerCase() > bID.toLowerCase()) ? -1 : 1;
            });
            self.isNameSortingOrder(true);
        }
        self.tableDataList(data);
    };
    
    this.idFilterValue = ko.observable();
    this.idFilterArray = ko.computed(function () {
        var idFilter = self.idFilterValue();
        self.tableDataList([]);
        if (!idFilter || idFilter === "") {
            self.tableDataList(self.FilterTblGridArr());
        } else {
            var data = ko.utils.arrayFilter(self.FilterTblGridArr(), function (sub) {
                return sub.customerid().toString().indexOf(idFilter) !== -1;
            });
            self.tableDataList(data);
        }
    });
    
    this.nameFilterValue = ko.observable();
    this.nameFilterArray = ko.computed(function () {
        var nameFilter = self.nameFilterValue();
        self.tableDataList([]);
        if (!nameFilter || nameFilter === "") {
            self.tableDataList(self.FilterTblGridArr());
        } else {
            var data = ko.utils.arrayFilter(self.FilterTblGridArr(), function (elem) {
                return elem.customername().toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1;
            });
            self.tableDataList(data);
        }
    });
    
    //#Region for Rulepagination
    this.RulepageSize = ko.observable(10);
    this.RulepageIndex = ko.observable(0);

    this.RulepagedList = ko.dependentObservable(function () {
        var size = self.RulepageSize();
        var start = self.RulepageIndex() * size;
        return self.tableDataList().slice(start, start + size);
    });

    this.RulemaxPageIndex = ko.dependentObservable(function () {
        return Math.ceil(self.tableDataList().length / self.RulepageSize()) - 1;
    });

    this.RulepreviousPage = function () {
        if (self.RulepageIndex() > 0) {
            self.RulepageIndex(self.RulepageIndex() - 1);
        }
    };

    this.RulenextPage = function () {
        if (self.RulepageIndex() < self.RulemaxPageIndex()) {
            self.RulepageIndex(self.RulepageIndex() + 1);
        }
    };

    this.RuleallPages = ko.dependentObservable(function () {
        var pages = [];
        for (i = 0; i <= self.RulemaxPageIndex() ; i++) {
            pages.push({ pageNumber: (i + 1) });
        }
        return pages;
    });

    this.RulePagesLength = ko.observable(10);

    this.RulePages = ko.dependentObservable(function () {
        var pages = [];
        if (self.RuleallPages().length <= self.RulePagesLength()) {
            for (i = 1 ; i <= (self.RuleallPages().length) ; i++) {
                pages.push({ pageNumber: (i) });
            }
        } else {
            if ((self.RulepageIndex() + self.RulePagesLength()) <= self.RuleallPages().length) {
                for (i = (Math.ceil((self.RulepageIndex() + 1) / self.RulePagesLength()) * self.RulePagesLength()) - self.RulePagesLength() ; i < Math.ceil((self.RulepageIndex() + 1) / self.RulePagesLength()) * self.RulePagesLength() ; i++) {
                    pages.push({ pageNumber: (i + 1) });
                }
            } else {
                for (i = (self.RuleallPages().length - self.RulePagesLength()) ; i < self.RuleallPages().length ; i++) {
                    pages.push({ pageNumber: (i + 1) });
                }
            }
        }
        return pages;
    });

    this.RulefirstPageClick = function () {
        self.RulepageIndex(0);
    };

    this.RulelastPageClick = function () {
        self.RulepageIndex(self.RulemaxPageIndex());
    };

    this.RulemoveToPage = function (index) {
        self.RulepageIndex(index);
    };

    this.RulepageVisible = ko.computed(function () {
        if (self.tableDataList().length !== 0) {
            if (self.tableDataList().length > self.RulepageSize()) {
                if (self.RulepagedList().length === 0) {
                    self.RulepageIndex(self.RulepageIndex() - 1);
                }
                return true;
            } else {
                if (self.RulepagedList().length === 0) {
                    self.RulepageIndex(self.RulepageIndex() - 1);
                }
                return false;
            }
        } else {
            return false;
        }
    });
    //#endregion for Rulepagination
};
