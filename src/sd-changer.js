export default function(context) {
    const doc = context.document
    const page = doc.currentPage()
    const selection = context.selection

    function changeFont(layer) {
        var fontName = layer.fontPostscriptName()
        var fontWeight = fontName.split("-")[1]
        var sdFontWeights = {
            "Thin": "Light",
            "UltraLight": "Light",
            "Light": "Light",
            "Regular": "Regular",
            "Medium": "Medium",
            "SemiBold": "SemiBold",
            "Bold": "Bold",
            "ExtraBold": "Heavy",
            "Heavy": "Heavy"
        };
        var sfFontWeights = {
            "Thin": "Thin",
            "UltraLight": "UltraLight",
            "Light": "Light",
            "Regular": "Regular",
            "Medium": "Medium",
            "SemiBold": "SemiBold",
            "Bold": "Bold",
            "ExtraBold": "ExtraBold",
            "Heavy": "Heavy"
        };
        var sdWeight = sdFontWeights[fontWeight]
        var sfWeight = sfFontWeights[fontWeight]

        if (fontName.hasPrefix("AppleSDGothicNeo")) {
            layer.select_byExpandingSelection(true, true)
            layer.fontPostscriptName = "SFProDisplay-" + sdWeight
            return true
        } else if (fontName.hasPrefix("SFProDisplay")) {
            layer.select_byExpandingSelection(true, true)
            layer.fontPostscriptName = "SFProDisplay-" + sfWeight
        }
        return false
    }

    function selectLayersByType(selectedlayer) {
        var count = 0

        if (selectedlayer.containsLayers() && selectedlayer.class() != "MSShapeGroup") {
            var loopChildrens = selectedlayer.children().objectEnumerator()
            var layer
            while (layer = loopChildrens.nextObject()) {
                if (layer.class() == MSTextLayer) {
                    var changed = changeFont(layer)
                    if (changed) count ++
                }
            }
        } else if (selectedlayer.containsLayers() == false && selectedlayer.class() == "MSTextLayer") {
            var changed = changeFont(selectedlayer)
            if (changed) count ++
        }
        return count
    }

    // Fix Sketch 45
    if (page.deselectAllLayers) {
        page.deselectAllLayers()
    } else {
        page.changeSelectionBySelectingLayers(nil)
    }

    var totalCount = 0

    if (selection.count() == 0) {
        var count = selectLayersByType(page) 
        totalCount = count
    } else {
        var loop = selection.objectEnumerator()
        var layer
        while (layer = loop.nextObject()) {
            var count = selectLayersByType(layer)
            totalCount += count
        }
    }

    if (totalCount == 0) {
        doc.showMessage("바꿀 레이어가 없습니다 😲")
    } else {
        doc.showMessage(totalCount + " 개의 레이어를 SF Display로 바꿨습니다 😎")
    }
}
