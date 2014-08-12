<!DOCTYPE html>
<html lang="en-GB">
	<head>
		<meta charset="utf-8">
		<title>Progressive enhancement</title>
	</head>

	<body>
		<script>
			(function(doc, undefined) {
				doc.cookie = 'js=true';
			}(this.document));
		</script>
		<?php echo $_COOKIE['js']; ?>
	</body>
</html>
