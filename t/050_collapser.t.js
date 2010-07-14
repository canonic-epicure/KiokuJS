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
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 5, 'Correct number of nodes is returned (`kids` array is shared, thus has its own node)')
        
        Joose.A.each(nodes, scope.pinNode, scope)
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking nodes structure')

        var homerNode   = nodes[0]
        var margeNode   = homerNode.data.spouse
        var kidsNode1   = homerNode.data.children
        var kidsNode2   = margeNode.data.children
        
        
        t.ok(homerNode.object === Homer, 'Homer is the object of the 1st node')
        t.ok(margeNode.object === Marge, 'Marge is the object of the `margeNode`')
        t.ok(kidsNode1 === kidsNode2, 'Kids node is shared')
        
        t.ok(kidsNode1.isFirstClass(), '.. and is a 1st class (referenced more than once)')
        
        
        var bartNode    = kidsNode1.data[0]
        var lisaNode    = kidsNode1.data[1]
        
        t.ok(bartNode.object === Bart, 'Bart is the object of the `bartNode`')
        t.ok(lisaNode.object === Lisa, 'Lisa is the object of the `lisaNode`')
        
        t.ok(margeNode.data.spouse === homerNode, 'Homer is a spouse of Marge (through the nodes relationship)')

        t.ok(lisaNode.data.father === homerNode, 'Lisa is the daugther of Homer (through the nodes relationship)')
        t.ok(lisaNode.data.mother === margeNode, 'Lisa is the daugther of Marge (through the nodes relationship)')
        
        t.ok(bartNode.data.father === homerNode, 'Bart is the son of Homer (through the nodes relationship)')
        t.ok(bartNode.data.mother === margeNode, 'Bart is the son of Marge (through the nodes relationship)')
        
        t.ok(homerNode.isRoot, 'Homer is in the root objects set')
        t.ok(!margeNode.isRoot, 'Marge is not in the root objects set')
        t.ok(!bartNode.isRoot, 'Bart is not in the root objects set')
        t.ok(!lisaNode.isRoot, 'Lisa is not in the root objects set')
        t.ok(!kidsNode1.isRoot, '`kids` is not in the root objects set')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Self-references')
        
        t.ok(homerNode.data.self === homerNode, 'Correct self-reference #1')
        t.ok(margeNode.data.self === margeNode, 'Correct self-reference #2')
        t.ok(bartNode.data.self === bartNode, 'Correct self-reference #3')
        t.ok(lisaNode.data.self === lisaNode, 'Correct self-reference #4')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('`objectToNode` method of the scope')
        
        t.ok(scope.objectToNode(Homer) === homerNode, 'Correct object for Homer')
        t.ok(scope.objectToNode(Marge) === margeNode, 'Correct object for Marge')
        t.ok(scope.objectToNode(Bart) === bartNode, 'Correct object for Bart')
        t.ok(scope.objectToNode(Lisa) === lisaNode, 'Correct object for Lisa')
        t.ok(scope.objectToNode(Homer.children) === kidsNode1, 'Correct object for Homer.children')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapsing with intrinsic entries, repeating collapsing')
        
        Homer.children = [ Bart, Lisa ]
        Marge.children = [ Bart, Lisa ]
        
        
        var collapser = new KiokuJS.Collapser({
            scope               : new KiokuJS.Scope({
                backend     : backend
            })
        })
        
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 4, 'Correct number of nodes is returned (`kids` array is intrinsic)')
        
        
        var homerNode   = nodes[0]
        var margeNode   = homerNode.data.spouse
        var kidsNode1   = homerNode.data.children
        var kidsNode2   = margeNode.data.children
        
        
        t.ok(kidsNode1 !== kidsNode2, 'Kids node is not shared')
        
        t.ok(!kidsNode1.isFirstClass(), 'Kids node are not first class this time')
        t.ok(!kidsNode2.isFirstClass(), 'Kids node are not first class this time')
        
        
        var bartNode1    = kidsNode1.data[0]
        var lisaNode1    = kidsNode1.data[1]
        
        var bartNode2    = kidsNode2.data[0]
        var lisaNode2    = kidsNode2.data[1]
        
        t.ok(bartNode1 === bartNode2, 'Bart node is shared between kids nodes')
        t.ok(lisaNode1 === lisaNode2, 'Lisa node is shared between kids nodes')
        
        t.ok(bartNode1.object === Bart, 'Bart is the object of the `bartNode`')
        t.ok(lisaNode1.object === Lisa, 'Lisa is the object of the `lisaNode`')
        
        t.done()
        
        t.endAsync(async0)
    })
})    