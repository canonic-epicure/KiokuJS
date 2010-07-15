StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,               "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,     "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Test.Person,   "'KiokuJS.Test.Person' is here")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        var Homer = new KiokuJS.Test.Person({
            name    : 'Homer Simpson'
        })
        
        var Marge = new KiokuJS.Test.Person({
            name    : 'Marge Simpson'
        })
        
        var Bart = new KiokuJS.Test.Person({
            name    : 'Bart Simpson'
        })
        
        var Lisa = new KiokuJS.Test.Person({
            name    : 'Lisa Simpson'
        })
        
        
        Homer.spouse(Marge)
        Marge.spouse(Homer)
        
        Bart.father     = Lisa.father  = Homer
        Bart.mother     = Lisa.mother   = Marge
        
        var kids = [ Bart, Lisa ]
        
        Homer.children = Marge.children = kids
        

        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard()
        })
        
        var scope       = new KiokuJS.Scope({
            backend     : backend
        })
        
        var collapser = new KiokuJS.Collapser({
            scope       : scope
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph and inserting them in the scope')
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 5, 'Correct number of nodes is returned (`kids` array is shared, thus has its own node)')
        
        Joose.A.each(nodes, scope.pinNode, scope)
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Setting up nodes & entries')
        
        var homerNode           = scope.objectToNode(Homer)
        var homerEntry          = backend.encodeNode(homerNode)
        
        var margeNode           = scope.objectToNode(Marge)
        var margeEntry          = backend.encodeNode(margeNode)

        var bartNode            = scope.objectToNode(Bart)
        var bartEntry           = backend.encodeNode(bartNode)

        var lisaNode            = scope.objectToNode(Lisa)
        var lisaEntry           = backend.encodeNode(lisaNode)
        
        var childrenNode        = scope.objectToNode(kids)
        var childrenEntry       = backend.encodeNode(childrenNode)

        
        //======================================================================================================================================================================================================================================================
        t.diag('Decoding entries')
        
        var homerNode2          = backend.decodeEntry(homerEntry)
        var margeNode2          = backend.decodeEntry(margeEntry)
        var bartNode2           = backend.decodeEntry(bartEntry)
        var lisaNode2           = backend.decodeEntry(lisaEntry)
        var childrenNode2       = backend.decodeEntry(childrenEntry)
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking newly decoded nodes')
        
        t.ok(homerNode2 != homerNode, 'New node for Homer is different')
        t.ok(margeNode2 != margeNode, 'New node for Marge is different')
        t.ok(bartNode2 != bartNode, 'New node for Bart is different')
        t.ok(lisaNode2 != lisaNode, 'New node for Lisa is different')
        t.ok(childrenNode2 != childrenNode, 'New node for children is different')
        

//        t.ok(homerEntry.$entry, "Homer's entry is marked with $entry")
//        t.ok(homerEntry.ID == homerNode.ID, "Homer's entry has correct ID")
//        
//        t.ok(homerEntry.className == 'KiokuJS.Test.Person', "Homer's entry has correct `className`")
//        
//        t.ok(homerData.name == 'Homer Simpson', "Homer's entry has correct name")
//        t.ok(homerData.self.$ref == homerEntry.ID, "Homer's entry has correct self-reference")
//        t.ok(homerData.spouse.$ref == margeNode.ID, "Homer's entry has correct `spouse` ref")
//        t.ok(homerData.children.$ref == childrenNode.ID, "Homer's entry has correct `children` ref")
//
//        
//        t.ok(margeEntry.$entry, "Marge's entry is marked with $entry")
//        t.ok(margeEntry.ID == margeNode.ID, "Marge's entry has correct ID")
//        
//        t.ok(margeEntry.className == 'KiokuJS.Test.Person', "Marge's entry has correct `className`")
//        
//        t.ok(margeData.name == 'Marge Simpson', "Marge's entry has correct name")
//        t.ok(margeData.self.$ref == margeEntry.ID, "Marge's entry has correct self-reference")
//        t.ok(margeData.spouse.$ref == homerNode.ID, "Marge's entry has correct `spouse` ref")
//        t.ok(margeData.children.$ref == childrenNode.ID, "Marge's entry has correct `children` ref")
//        
//        
//        t.ok(childrenEntry.$entry, "Children's entry is marked with $entry")
//        t.ok(childrenEntry.ID == childrenNode.ID, "Children's entry has correct ID")
//        
//        t.ok(childrenEntry.className == 'Array', "Children's entry has correct `className`")
//        
//        t.ok(childrenData[0].$ref == bartNode.ID, "Children's entry has correct first element")
//        t.ok(childrenData[1].$ref == lisaNode.ID, "Children's entry has correct second element")
//
//
//        t.ok(bartEntry.$entry, "Bart's entry is marked with $entry")
//        t.ok(bartEntry.ID == bartNode.ID, "Bart's entry has correct ID")
//        
//        t.ok(bartEntry.className == 'KiokuJS.Test.Person', "Bart's entry has correct `className`")
//        
//        t.ok(bartData.name == 'Bart Simpson', "Bart's entry has correct name")
//        t.ok(bartData.self.$ref == bartEntry.ID, "Bart's entry has correct self-reference")
//        t.ok(bartData.father.$ref == homerNode.ID, "Bart's entry has correct `father` ref")
//        t.ok(bartData.mother.$ref == margeNode.ID, "Bart's entry has correct `mother` ref")
//        
//        
//        t.ok(lisaEntry.$entry, "Lisa's entry is marked with $entry")
//        t.ok(lisaEntry.ID == lisaNode.ID, "Lisa's entry has correct ID")
//        
//        t.ok(lisaEntry.className == 'KiokuJS.Test.Person', "Lisa's entry has correct `className`")
//        
//        t.ok(lisaData.name == 'Lisa Simpson', "Lisa's entry has correct name")
//        t.ok(lisaData.self.$ref == lisaEntry.ID, "Lisa's entry has correct self-reference")
//        t.ok(lisaData.father.$ref == homerNode.ID, "Lisa's entry has correct `father` ref")
//        t.ok(lisaData.mother.$ref == margeNode.ID, "Lisa's entry has correct `mother` ref")
        
        
        t.done()
        
        t.endAsync(async0)
    })
})    