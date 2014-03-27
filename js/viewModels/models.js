// models a site
function Site(siteId, siteUniqId, friendlyId, domain, name, logoUrl, theme, analyticsId, facebookAppId, primaryEmail, timeZone, language, currency, weightUnit, shippingCalculation, shippingRate, shippingTiers, taxRate, payPalId, lastLogin, type, customerId, created, analyticssubdomain, analyticsmultidomain, analyticsdomain){

    var self = this;

    self.siteId = ko.observable(siteId);
    self.siteUniqId = ko.observable(siteUniqId);
	self.friendlyId = ko.observable(friendlyId);
    self.domain = ko.observable(domain);
    self.name = ko.observable(name);
    self.logoUrl = ko.observable(logoUrl);
    self.theme = ko.observable(theme);
    self.analyticsId = ko.observable(analyticsId);
    self.analyticssubdomain = ko.observable(analyticssubdomain);
    self.analyticsmultidomain = ko.observable(analyticsmultidomain);
    self.analyticsdomain = ko.observable(analyticsdomain);
    self.facebookAppId = ko.observable(facebookAppId);
    self.primaryEmail = ko.observable(primaryEmail);
    self.timeZone = ko.observable(timeZone);
    self.language = ko.observable(language);
    self.currency = ko.observable(currency);
    self.weightUnit = ko.observable(weightUnit);
    self.shippingCalculation = ko.observable(shippingCalculation);
    self.shippingRate = ko.observable(shippingRate);
    self.shippingTiers = ko.observable(shippingTiers);
    self.taxRate = ko.observable(taxRate);
    self.payPalId = ko.observable(payPalId);
    self.lastLogin = ko.observable(lastLogin);
    self.type = ko.observable(type);
    self.customerId = ko.observable(customerId);
    self.created = ko.observable(created);
}

// creates a site based on data returned from the API
Site.create = function(data){

	return new Site(data['SiteId'], data['SiteUniqId'], data['FriendlyId'], data['Domain'], data['Name'], data['LogoUrl'], data['Theme'],
                    data['AnalyticsId'], data['FacebookAppId'], data['PrimaryEmail'], data['TimeZone'], data['Language'], data['Currency'], data['WeightUnit'], data['ShippingCalculation'], data['ShippingRate'], data['ShippingTiers'], data['TaxRate'], data['PayPalId'], data['LastLogin'], data['Type'], data['CustomerId'], data['Created'],
                    Number(data['AnalyticsSubdomain']), Number(data['AnalyticsMultidomain']), data['AnalyticsDomain']);
}

// models a user
function User(userId, userUniqId, email, password, firstName, lastName, photoUrl, role, language, isActive, created, token){

    var self = this;

    self.userId = ko.observable(userId);
    self.userUniqId = ko.observable(userUniqId);
    self.email = ko.observable(email);
    self.password = ko.observable(password);
    self.firstName = ko.observable(firstName);
    self.lastName = ko.observable(lastName);
    self.photoUrl = ko.observable(photoUrl);
    self.role = ko.observable(role);
    self.language = ko.observable(language);
    self.isActive = ko.observable(isActive);
    self.created = ko.observable(created);
    self.token = ko.observable(token);
    
    self.hasPhotoUrl = ko.computed(function(){
    	if(self.photoUrl() == '' || self.photoUrl() == null || self.photoUrl() == undefined){
	    	return false;
    	}
    	else{
	    	return true;
    	}
	});
    
    
    self.fullName = ko.computed(function(){
    	return self.firstName() + ' ' + self.lastName();
	});
    
    self.friendlyDate = ko.computed(function(){
    	var st = moment.utc(self.created(), 'YYYY-MM-DD HH:mm:ss');
		return st.fromNow(); 
	});

}

// creates a user based on data returned from the API
User.create = function(data){

	return new User(data['UserId'], data['UserUniqId'], data['Email'], data['Password'], data['FirstName'], data['LastName'], data['PhotoUrl'],  data['Role'], data['Language'], data['IsActive'], data['Created'], data['Token']);
}


// models a page
function Page(pageId, pageUniqId, pageTypeId, friendlyId, name, description, keywords, callout, 
				beginDate, endDate,
				location, latLong,
				rss, layout, stylesheet, url, image, thumb, lastModifiedDate, lastModifiedFullName, isActive){

	var self = this;

	self.pageId = ko.observable(pageId);
	self.pageUniqId = ko.observable(pageUniqId);
	self.pageTypeId = ko.observable(pageTypeId);
	self.friendlyId = ko.observable(friendlyId);
	self.name = ko.observable(name);
	self.description = ko.observable(description);
	self.keywords = ko.observable(keywords);
	self.callout = ko.observable(callout);
	self.beginDate = ko.observable(beginDate);
	self.endDate = ko.observable(endDate);
	self.location = ko.observable(location);
	self.latLong = ko.observable(latLong);
	self.rss = ko.observable(rss);
	self.layout = ko.observable(layout);
	self.stylesheet = ko.observable(stylesheet);
	self.url = ko.observable(url);
	self.image = ko.observable(image);
	self.thumb = ko.observable(thumb);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.lastModifiedFullName = ko.observable(lastModifiedFullName);
	self.isActive = ko.observable(isActive);

	self.friendlyDate = ko.computed(function(){
		var st = moment.utc(self.lastModifiedDate(), 'YYYY-MM-DD HH:mm:ss');
		return st.fromNow(); 
	});

	self.rssArr = ko.computed(function(){
		if(self.rss()){
			return self.rss().split(',');
		}
		else{
			return [];
		};
	});

	self.editUrl = ko.computed(function(){
		return 'content?p=' + self.pageUniqId();
	});
	
	self.localBeginDate = ko.computed(function(){
		if(self.beginDate() != null && self.beginDate() != ''){
			var offset = $('body').attr('data-offset');
			
			var m = moment.utc(self.beginDate(), 'YYYY-MM-DD HH:mm:ss');
			m.zone(offset);
			
			return m.format('YYYY-MM-DD');
		}
		else{
			return '';
		}
	});
	

	self.localBeginTime = ko.computed(function(){
		if(self.beginDate() != null && self.beginDate() != ''){
			var offset = $('body').attr('data-offset');
			
			var m = moment.utc(self.beginDate(), 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.format('HH:mm:ss');
		}
		else{
			return '';
		}
	});
	
	self.localEndDate = ko.computed(function(){
	
		if(self.endDate() != null && self.endDate() != ''){
			var offset = $('body').attr('data-offset');
			
			var m = moment.utc(self.endDate(), 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.format('YYYY-MM-DD');
		}
		else{
			return '';
		}
	});
	

	self.localEndTime = ko.computed(function(){
	
		if(self.endDate() != null && self.endDate() != ''){
			var offset = $('body').attr('data-offset');
			
			var m = moment.utc(self.endDate(), 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.format('HH:mm:ss');
		}
		else{
			return '';
		}
	});
	
	
	self.latitude = ko.computed(function(){
	
		if(self.latLong() != null && self.latLong() != ''){
		
			var point = self.latLong().replace('POINT(', '').replace(')', '');
			var arr = point.split(' ');
		
			
			return arr[0];
		}
		else{
			return '';
		}
	});
	
	self.longitude = ko.computed(function(){
	
	
		if(self.latLong() != null && self.latLong() != ''){
			
			var point = self.latLong().replace('POINT(', '').replace(')', '');
			var arr = point.split(' ');
			
			return arr[1];
		}
		else{
			return '';
		}
		
	});

}

// creates a page based on data returned from the API
Page.create = function(data){

	return new Page(data['PageId'], data['PageUniqId'], data['PageTypeId'], data['FriendlyId'], data['Name'], data['Description'], 
					data['Keywords'], data['Callout'], 
					data['BeginDate'], data['EndDate'],
					data['Location'], data['LatLong'],
					data['Rss'], data['Layout'], data['Stylesheet'], 
					data['Url'], data['Image'], data['Thumb'], data['LastModifiedDate'], data['LastModifiedFullName'], 
					data['IsActive']);
}

// models a category
function Category(categoryId, categoryUniqId, pageTypeId, friendlyId, name){

	var self = this;

	self.categoryId = ko.observable(categoryId);
	self.categoryUniqId = ko.observable(categoryUniqId);
	self.pageTypeId = ko.observable(pageTypeId);
	self.friendlyId = ko.observable(friendlyId);
	self.name = ko.observable(name);
}

// creates a category based on data returned from the API
Category.create = function(data){

	return new Category(data['CategoryId'], data['CategoryUniqId'], data['PageTypeId'], data['FriendlyId'], data['Name']);
}

// models a pagetype
function PageType(pageTypeId, pageTypeUniqId, friendlyId, typeS, typeP, layout, stylesheet, isSecure, createdBy, lastModifiedBy, lastModifiedDate, created){

	var self = this;

	self.pageTypeId = ko.observable(pageTypeId);
	self.pageTypeUniqId = ko.observable(pageTypeUniqId);
	self.friendlyId = ko.observable(friendlyId);
	self.typeS = ko.observable(typeS);
	self.typeP = ko.observable(typeP);
	self.layout = ko.observable(layout);
	self.stylesheet = ko.observable(stylesheet);
	self.isSecure = ko.observable(isSecure);
	self.createdBy = ko.observable(createdBy);
	self.lastModifiedBy = ko.observable(lastModifiedBy);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.created = ko.observable(created);

	self.dir = ko.computed(function(){
	
		if(self.isSecure()==1){
			return '/' + self.typeS().toLowerCase() + '<span class="lock fa fa-lock"></span>';
		}
		else{
			return '/' + self.typeS().toLowerCase();
		}
		
	});

}

// creates a pagetype based on data returned from the API
PageType.create = function(data){

	return new PageType(data['PageTypeId'], data['PageTypeUniqId'], data['FriendlyId'],
						data['TypeS'], data['TypeP'], data['Layout'], data['Stylesheet'], data['IsSecure'], data['CreatedBy'], data['LastModifiedBy'],
						data['LastModifiedDate'], data['Created']);
}

// models a menutype
function MenuType(menuTypeId, menuTypeUniqId, friendlyId, name, createdBy, lastModifiedBy, lastModifiedDate, created){

	var self = this;

	self.menuTypeId = ko.observable(menuTypeId);
	self.menuTypeUniqId = ko.observable(menuTypeUniqId);
	self.friendlyId = ko.observable(friendlyId);
	self.name = ko.observable(name);
	self.createdBy = ko.observable(createdBy);
	self.lastModifiedBy = ko.observable(lastModifiedBy);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.created = ko.observable(created);

}

// creates a menutype based on data returned from the API
MenuType.create = function(data){

	return new MenuType(data['MenuTypeId'], data['MenuTypeUniqId'], data['FriendlyId'],
						data['Name'], data['CreatedBy'], data['LastModifiedBy'],
						data['LastModifiedDate'], data['Created']);
}

// models a menuitem
function MenuItem(menuItemId, menuItemUniqId, name, cssClass, type, url, pageId, priority, isNested, createdBy, lastModifiedBy, lastModifiedDate, created){

    var self = this;

	self.menuItemId = ko.observable(menuItemId);
	self.menuItemUniqId = ko.observable(menuItemUniqId);
	self.name = ko.observable(name);
    self.cssClass = ko.observable(cssClass);
    self.type = ko.observable(type);
    self.url = ko.observable(url);
    self.pageId = ko.observable(pageId);
    self.priority = ko.observable(priority);
    self.isNested = ko.observable(isNested);
	self.createdBy = ko.observable(createdBy);
	self.lastModifiedBy = ko.observable(lastModifiedBy);
	self.lastModifiedDate = ko.observable(lastModifiedDate);
	self.created = ko.observable(created);

}

// creates a menuitem based on data returned from the API
MenuItem.create = function(data){

	return new MenuItem(data['MenuItemId'], data['MenuItemUniqId'], data['Name'], data['CssClass'],
						data['Type'], data['Url'], data['PageId'], data['Priority'], data['IsNested'], 
                        data['CreatedBy'], data['LastModifiedBy'],	data['LastModifiedDate'], data['Created']);
}

// models a theme
function Theme(id, name, desc){

    var self = this;

    self.id = ko.observable(id);
	self.name = ko.observable(name);
	self.desc = ko.observable(desc);

}

// creates a theme based on data returned from the API
Theme.create = function(data){

	return new Theme(data['id'], data['name'], data['desc']);
}