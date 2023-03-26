---
title: "Cookie lišta 2022"
date: 2022-02-07T17:26:20+01:00
draft: true
---

# Cookie lišta 2022

Nastavení data layeru

## Google Analytics 4

```javascript
window.dataLayer = window.dataLayer || [];
function gtag() {
	dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("consent", "default", {
	ad_storage: "denied",
	analytics_storage: "denied",
	personaliyation_storage: "denied",
});
```

## Google universal analytics

```html
<script
	async
	src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-XX"
></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag("js", new Date());
	gtag("config", "UA-XXXXX-XX", {
		client_storage: "none",
		anonymize_ip: true,
	});
</script>
```
