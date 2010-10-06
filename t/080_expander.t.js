StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,                   "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,         "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Linker.Expander,   "'KiokuJS.Linker.Expander' is here")
        t.ok(KiokuJS.Test.Person,       "'KiokuJS.Test.Person' is here")

        
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
        
        var collapser = new KiokuJS.Collapser({
            scope       : scope
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph and inserting them in the scope')
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 5, 'Correct number of nodes is returned (`kids` array is shared, thus has its own node)')
        
        var homerID = nodes[0].ID

        
        //======================================================================================================================================================================================================================================================
        t.diag('Round-triping nodes')
        
        var roundTrip = function (scope, backend, nodes) {
            
            var strings = backend.serialize(scope.encodeNodes(nodes))
            var nodes   = scope.decodeEntries(backend.deserialize(strings))
            
            return nodes
        }
        
        
        var nodes2           = roundTrip(scope, backend, nodes)
        
        var nodesByID = {}
        
        Joose.A.each(nodes2, function (node) {
            t.ok(!node.isLive(), 'Round-tripped nodes have no objects')
            
            nodesByID[ node.ID ] = node
        })
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Animating nodes')
        
        var linker = new KiokuJS.Linker({
            nodes   : nodesByID,
            scope   : scope
        })
        
        linker.animateNodes()
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking newly created objects')
        
        var Homer2          = scope.idToObject(homerID)
        var Marge2          = Homer2.spouse()
        

        t.isaOk(Homer2, KiokuJS.Test.Person, "Home2 is an instance of correct class")
        t.isaOk(Marge2, KiokuJS.Test.Person, "Marge2 is an instance of correct class")
        
        t.ok(Homer2 != Homer, 'New instance for Homer was created')
        t.ok(Marge2 != Marge, 'New instance for Marge was created')
        
        t.ok(Homer2.self == Homer2, 'Homer2 has correct self-reference')
        t.ok(Marge2.self == Marge2, 'Marge2 has correct self-reference')
        
        t.ok(Marge2.spouse() == Homer2, 'Marge2 is a spouse of Homer2')


        //======================================================================================================================================================================================================================================================
        t.diag("Checking that objects has no values for attributes which hasn't been stored")
        
        t.ok(!Homer2.hasOwnProperty('age'), 'Homer has no own `age` property')
        
        t.ok(Homer2.age === 0, 'Its `age` value is coming from the prototype')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking newly created objects - continued')
        
        
        var children2Homer  = Homer2.children 
        var children2Marge  = Marge2.children
        
        t.ok(children2Marge == children2Homer, 'Both spouses have the same children')
        
        t.isaOk(children2Homer, Array, 'children2Homer is an instance of correct class')
        
        
        var Bart2           = children2Homer[0]
        var Lisa2           = children2Homer[1]
        

        t.isaOk(Bart2, KiokuJS.Test.Person, "Bart2 is an instance of correct class")
        t.isaOk(Lisa2, KiokuJS.Test.Person, "Lisa2 is an instance of correct class")
        
        t.ok(Bart2 != Bart, 'New instance for Bart was created')
        t.ok(Lisa2 != Lisa, 'New instance for Lisa was created')
        
        t.ok(Bart2.self == Bart2, 'Bart2 has correct self-reference')
        t.ok(Lisa2.self == Lisa2, 'Lisa2 has correct self-reference')
        
        
        t.ok(Bart2.father == Homer2, 'Bart2 has Homer2 as a father')
        t.ok(Lisa2.father == Homer2, 'Lisa2 has Homer2 as a father')
        t.ok(Bart2.mother == Marge2, 'Bart2 has Marge2 as a mother')
        t.ok(Lisa2.mother == Marge2, 'Lisa2 has Marge2 as a mother')
        

        t.done()
        
        t.endAsync(async0)
    })
})    