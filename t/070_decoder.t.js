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
        
        t.isaOk(homerNode2, KiokuJS.Node, "Entry decoded into Node #1")
        t.isaOk(margeNode2, KiokuJS.Node, "Entry decoded into Node #2")
        t.isaOk(childrenNode2, KiokuJS.Node, "Entry decoded into Node #3")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Homer')
        
        var homerData2 = homerNode2.data
        
        t.ok(!homerNode2.$entry, "Homer's new node has no $entry marker")
        t.ok(homerNode2.ID == homerNode.ID, "IDs are identical")
        
        t.ok(homerNode2.className == 'KiokuJS.Test.Person', "New Homer's node has correct `className`")
        
        t.ok(homerData2.name == 'Homer Simpson', "Homer's new node has correct name")
        
        t.isaOk(homerData2.self, KiokuJS.Reference, ".. `self` value has correct class")
        t.ok(homerData2.self.ID == homerNode2.ID, ".. and it refer to the node itself")
        
        t.isaOk(homerData2.spouse, KiokuJS.Reference, ".. `spouse` value has correct class")
        t.ok(homerData2.spouse.ID == margeNode2.ID, ".. and it refer to the Marge node")

        t.isaOk(homerData2.children, KiokuJS.Reference, ".. `children` value has correct class")
        t.ok(homerData2.children.ID == childrenNode2.ID, ".. and it refer to the childrenNode2 node")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Marge')
        
        var margeData2 = margeNode2.data
        
        t.ok(!margeNode2.$entry, "Marge's new node has no $entry marker")
        t.ok(margeNode2.ID == margeNode.ID, "IDs are identical")
        
        t.ok(margeNode2.className == 'KiokuJS.Test.Person', "New Marge's node has correct `className`")
        
        t.ok(margeData2.name == 'Marge Simpson', "Marge's new node has correct name")
        
        t.isaOk(margeData2.self, KiokuJS.Reference, ".. `self` value has correct class")
        t.ok(margeData2.self.ID == margeNode2.ID, ".. and it refer to the node itself")
        
        t.isaOk(margeData2.spouse, KiokuJS.Reference, ".. `spouse` value has correct class")
        t.ok(margeData2.spouse.ID == homerNode2.ID, ".. and it refer to the Marge node")

        t.isaOk(margeData2.children, KiokuJS.Reference, ".. `children` value has correct class")
        t.ok(margeData2.children.ID == childrenNode2.ID, ".. and it refer to the childrenNode2 node")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Bart')
        
        var bartData2 = bartNode2.data
        
        t.ok(!bartNode2.$entry, "Bart's new node has no $entry marker")
        t.ok(bartNode2.ID == bartNode.ID, "IDs are identical")
        
        t.ok(bartNode2.className == 'KiokuJS.Test.Person', "New Bart's node has correct `className`")
        
        t.ok(bartData2.name == 'Bart Simpson', "Bart's new node has correct name")
        
        t.isaOk(bartData2.self, KiokuJS.Reference, ".. `self` value has correct class")
        t.ok(bartData2.self.ID == bartNode2.ID, ".. and it refer to the node itself")
        
        t.isaOk(bartData2.father, KiokuJS.Reference, ".. `father` value has correct class")
        t.isaOk(bartData2.mother, KiokuJS.Reference, ".. `mother` value has correct class")
        t.ok(bartData2.father.ID == homerNode2.ID, ".. `father` value refer to Homer")
        t.ok(bartData2.mother.ID == margeNode2.ID, ".. `mother` value refer to Marge")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Lisa')
        
        var lisaData2 = lisaNode2.data
        
        t.ok(!lisaNode2.$entry, "Lisa's new node has no $entry marker")
        t.ok(lisaNode2.ID == lisaNode.ID, "IDs are identical")
        
        t.ok(lisaNode2.className == 'KiokuJS.Test.Person', "New Lisa's node has correct `className`")
        
        t.ok(lisaData2.name == 'Lisa Simpson', "Lisa's new node has correct name")
        
        t.isaOk(lisaData2.self, KiokuJS.Reference, ".. `self` value has correct class")
        t.ok(lisaData2.self.ID == lisaNode2.ID, ".. and it refer to the node itself")
        
        t.isaOk(lisaData2.father, KiokuJS.Reference, ".. `father` value has correct class")
        t.isaOk(lisaData2.mother, KiokuJS.Reference, ".. `mother` value has correct class")
        t.ok(lisaData2.father.ID == homerNode2.ID, ".. `father` value refer to Homer")
        t.ok(lisaData2.mother.ID == margeNode2.ID, ".. `mother` value refer to Marge")

        
        t.done()
        
        t.endAsync(async0)
    })
})    