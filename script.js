var helper = (function(win, doc, undefined) {

	// http://www.quirksmode.org/js/xmlhttp.html
	return {
		sendRequest: function(url,callback,postData) {
			var req = createXMLHTTPObject();
			if (!req) return;
			var method = (postData) ? "POST" : "GET";
			req.open(method,url,true);
			//req.setRequestHeader('User-Agent','XMLHTTP/1.0');
			if (postData)
				req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			req.onreadystatechange = function () {
				if (req.readyState != 4) return;
				if (req.status != 200 && req.status != 304) {
		//		  alert('HTTP error ' + req.status);
					return;
				}
				callback(req);
			}
			if (req.readyState == 4) return;
			req.send(postData);
		}
	};

	function createXMLHTTPObject() {

		var XMLHttpFactories = [
			function () {return new XMLHttpRequest()},
			function () {return new ActiveXObject("Msxml2.XMLHTTP")},
			function () {return new ActiveXObject("Msxml3.XMLHTTP")},
			function () {return new ActiveXObject("Microsoft.XMLHTTP")}
		];

		var xmlhttp = false,
			i,
			ii = XMLHttpFactories.length;

		for (i=0;i<ii;i++) {
			try {
				xmlhttp = XMLHttpFactories[i]();
			}
			catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	}

}(this, this.document));


/* ==========================================================================
   Build the product list
   ========================================================================== */
(function(win, doc, undefined) {
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
				item.id = 'product_form_' + product['entity_id'];


				/* Image
				   ========================================================================== */
				var item_img = doc.createElement('img');

				item_img.src = 'images' + product['small_image'];
				item_img.alt = product.name;
				item_img.width = 100;

				item.appendChild(item_img);


				/* Title
				   ========================================================================== */
				var title = doc.createElement('h1');

				title.textContent = product['name'];

				item.appendChild(title);


				/* Description
				   ========================================================================== */
				var desc = doc.createElement('p');

				desc.textContent = product['short_description'];

				item.appendChild(desc);


				/* Link
				   ========================================================================== */
				var link = doc.createElement('p'),
					anchor = doc.createElement('a');

				anchor.href = product['url_key'];
				anchor.textContent = 'View';

				link.appendChild(anchor);

				item.appendChild(link);


				/* ID
				   ========================================================================== */
				var id = doc.createElement('input');

				id.setAttribute('type', 'hidden');
				id.name = 'product_id';
				id.value = product['entity_id'];

				item.appendChild(id);


				/* Button
				   ========================================================================== */
				var button = doc.createElement('button');

				button.id = 'btn_' + product['entity_id'];
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
	}

	helper.sendRequest('simple.json', populate, true);

}(this, this.document));

/*<form id="product_form_<?php echo $data->entity_id; ?>" method="POST" action="/process-add-to-cart.php">

			<img src="<?php echo THEME_URL.'/scripts/timthumb.php?src='.PRODUCT_IMAGE_DIR.$data->small_image; ?>&w=100" alt="<?php echo $data->name; ?>" title="<?php echo $data->name; ?>" border="0" width="100"/>

			<h2><?php echo $data->name; ?></h2>

			<p><?php echo $data->short_description; ?></p>

			<?php $price = get_price($data->entity_id,$group_id); ?>

			<?php if ($price['savings']): ?>
			<span class="old-price" style="color: #a0a0a0; text-decoration: line-through;"><?php echo $price['original_price']; ?></span>
			<p style="color:red">Save <?php echo $price['savings']; ?></p>
			<?php endif; ?>

			<h3><?php echo $price['price']; ?></h3>

			<p><a href="/product/<?php echo $data->url_key; ?>">View</a></p>

			<input type="hidden" name="product_id" value="<?php echo $data->entity_id; ?>"/>

			<button id="btn_<?php echo $data->entity_id; ?>" class="add-to-cart" type="submit">Add</button>

		</form>

		<hr>
*/