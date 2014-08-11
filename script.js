var helper = (function(win, doc, undefined) {
	'use strict';

	return {
		makeRequest: function(url, fn, method) {
			if(win.XMLHttpRequest && 'classList' in doc.createElement('a')) {
				var req = new XMLHttpRequest();

				if(!req) {
					return;
				}

				req.onreadystatechange = function() {
					if(req.readyState !== 4) {
						return;
					}

					if(req.status !== 200) {
						return;
					}

					fn(req);
				};

				req.open(method, url);
				if(method === 'POST') {
					req.setRequestHeader('Content-Type', 'application/json');
				}
				req.send();
			}
		}
	};

}(this, this.document));


/* ==========================================================================
   Build the product list
   ========================================================================== */
(function(win, doc, undefined) {
	'use strict';

	if(win.XMLHttpRequest && 'classList' in doc.createElement('a')) {
		var populate = function(req) {
			var data = JSON.parse(req.response);

			if(data) {
				var i = 0,
					data_length = data.length,
					wrapper = doc.getElementById('products'),
					frag = doc.createDocumentFragment(),
					product;

				for(i; i < data_length; i++) {
					product = data[i];


					/* Product wrapper
					   ========================================================================== */
					var item = doc.createElement('form');

					item.method = 'post';
					item.action = '/';
					item.id = 'product_form_' + product.entity_id;


					/* Image
					   ========================================================================== */
					var item_img = doc.createElement('img');

					item_img.src = 'images' + product.small_image;
					item_img.alt = product.name;
					item_img.width = 100;

					item.appendChild(item_img);


					/* Title
					   ========================================================================== */
					var title = doc.createElement('h1');

					title.textContent = product.name;

					item.appendChild(title);


					/* Description
					   ========================================================================== */
					var desc = doc.createElement('p');

					desc.textContent = product.short_description;

					item.appendChild(desc);


					/* Link
					   ========================================================================== */
					var link = doc.createElement('p'),
						anchor = doc.createElement('a');

					anchor.href = product.url_key;
					anchor.textContent = 'View';

					link.appendChild(anchor);

					item.appendChild(link);


					/* ID
					   ========================================================================== */
					var id = doc.createElement('input');

					id.setAttribute('type', 'hidden');
					id.name = 'product_id';
					id.value = product.entity_id;

					item.appendChild(id);


					/* Button
					   ========================================================================== */
					var button = doc.createElement('button');

					button.id = 'btn_' + product.entity_id;
					button.className = 'add-to-cart';
					button.setAttribute('type', 'submit');
					button.textContent = 'Add';

					item.appendChild(button);


					/* Add to fragment
					   ========================================================================== */
					frag.appendChild(item);
				}

				/* Insert into DOM
				   ========================================================================== */
				wrapper.appendChild(frag);
			} else {
				return;
			}
		};

		helper.makeRequest('simple.json', populate, 'GET');
	}

}(this, this.document));