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
        
        var backend     = new KiokuJS.Backend.Hash()
        var scope       = backend.newScope()
        
        var collapser   = new KiokuJS.Collapser({
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
        var homerData           = homerEntry.data
        
        var margeNode           = scope.objectToNode(Marge)
        var margeEntry          = backend.encodeNode(margeNode)
        var margeData           = margeEntry.data

        var bartNode            = scope.objectToNode(Bart)
        var bartEntry           = backend.encodeNode(bartNode)
        var bartData            = bartEntry.data

        var lisaNode            = scope.objectToNode(Lisa)
        var lisaEntry           = backend.encodeNode(lisaNode)
        var lisaData            = lisaEntry.data
        
        var childrenNode        = scope.objectToNode(kids)
        var childrenEntry       = backend.encodeNode(childrenNode)
        var childrenData        = childrenEntry.data

        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        

        t.ok(homerEntry.$entry, "Homer's entry is marked with $entry")
        t.ok(homerEntry.ID == homerNode.ID, "Homer's entry has correct ID")
        
        t.ok(homerEntry.className == 'KiokuJS.Test.Person', "Homer's entry has correct `className`")
        
        t.ok(homerData.name == 'Homer Simpson', "Homer's entry has correct name")
        t.ok(homerData.self.$ref == homerEntry.ID, "Homer's entry has correct self-reference")
        t.ok(homerData.spouse.$ref == margeNode.ID, "Homer's entry has correct `spouse` ref")
        t.ok(homerData.children.$ref == childrenNode.ID, "Homer's entry has correct `children` ref")
        
        t.ok(!homerData.hasOwnProperty('age'), "No property for 'age' attribute (entry only contain attributes with values)")
        t.ok(!homerData.hasOwnProperty('task'), "No property for 'task' attribute (entry only contain attributes with values)")

        
        t.ok(margeEntry.$entry, "Marge's entry is marked with $entry")
        t.ok(margeEntry.ID == margeNode.ID, "Marge's entry has correct ID")
        
        t.ok(margeEntry.className == 'KiokuJS.Test.Person', "Marge's entry has correct `className`")
        
        t.ok(margeData.name == 'Marge Simpson', "Marge's entry has correct name")
        t.ok(margeData.self.$ref == margeEntry.ID, "Marge's entry has correct self-reference")
        t.ok(margeData.spouse.$ref == homerNode.ID, "Marge's entry has correct `spouse` ref")
        t.ok(margeData.children.$ref == childrenNode.ID, "Marge's entry has correct `children` ref")
        
        t.ok(!margeData.hasOwnProperty('age'), "No property for 'age' attribute (entry only contain attributes with values)")
        
        
        t.ok(childrenEntry.$entry, "Children's entry is marked with $entry")
        t.ok(childrenEntry.ID == childrenNode.ID, "Children's entry has correct ID")
        
        t.ok(childrenEntry.className == 'Array', "Children's entry has correct `className`")
        
        t.ok(childrenData[0].$ref == bartNode.ID, "Children's entry has correct first element")
        t.ok(childrenData[1].$ref == lisaNode.ID, "Children's entry has correct second element")


        t.ok(bartEntry.$entry, "Bart's entry is marked with $entry")
        t.ok(bartEntry.ID == bartNode.ID, "Bart's entry has correct ID")
        
        t.ok(bartEntry.className == 'KiokuJS.Test.Person', "Bart's entry has correct `className`")
        
        t.ok(bartData.name == 'Bart Simpson', "Bart's entry has correct name")
        t.ok(bartData.self.$ref == bartEntry.ID, "Bart's entry has correct self-reference")
        t.ok(bartData.father.$ref == homerNode.ID, "Bart's entry has correct `father` ref")
        t.ok(bartData.mother.$ref == margeNode.ID, "Bart's entry has correct `mother` ref")
        
        
        t.ok(lisaEntry.$entry, "Lisa's entry is marked with $entry")
        t.ok(lisaEntry.ID == lisaNode.ID, "Lisa's entry has correct ID")
        
        t.ok(lisaEntry.className == 'KiokuJS.Test.Person', "Lisa's entry has correct `className`")
        
        t.ok(lisaData.name == 'Lisa Simpson', "Lisa's entry has correct name")
        t.ok(lisaData.self.$ref == lisaEntry.ID, "Lisa's entry has correct self-reference")
        t.ok(lisaData.father.$ref == homerNode.ID, "Lisa's entry has correct `father` ref")
        t.ok(lisaData.mother.$ref == margeNode.ID, "Lisa's entry has correct `mother` ref")
        
        
        t.done()
        
        t.endAsync(async0)
    })
})    