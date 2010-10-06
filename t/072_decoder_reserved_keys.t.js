StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Collapser setup')
    
    var backend     = new KiokuJS.Backend.Hash()
    var scope       = backend.newScope()
    
    var collapser = new KiokuJS.Collapser({
        scope       : scope
    })
    
    t.ok(collapser, "KiokuJS collapser was instantiated")
        

        
    Class('Some.Class', {
        
        has : {
            $ref    : null,
            $entry  : null
        }
    })

        
    //======================================================================================================================================================================================================================================================
    t.diag('Graph setup')
    
    var instance = new Some.Class()
    
    instance.$ref   = instance
    instance.$entry = {
        $ref    : [ '$ref' ],
        $entry  : 123
    }
        
        
    //======================================================================================================================================================================================================================================================
    t.diag('Collapsing')

    var nodes = collapser.collapse({}, [ instance ])
    
    t.ok(nodes.length == 1, 'Correct number of nodes was returned')
        
    Joose.A.each(nodes, scope.pinNode, scope)
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setting up nodes & entries')
    
    var instanceNode            = scope.objectToNode(instance)

    
    //======================================================================================================================================================================================================================================================
    t.diag('Decoding entries')
    
    var roundTrip = function (scope, backend, node) {
        
        var strings = backend.serialize(scope.encodeNodes([ node ]))
        var nodes   = scope.decodeEntries(backend.deserialize(strings))
        
        return nodes[0]
    }
    

    var instanceNode2           = roundTrip(scope, backend, instanceNode)
    var instanceData2           = instanceNode2.data
    
    
    t.isaOk(instanceData2.$ref, KiokuJS.Reference, 'Correct class for `instanceData2.$ref`')
    t.ok(instanceData2.$ref.ID == instanceNode2.ID, 'Correct self-reference with reserved key')
    
    var $entryData = instanceData2.$entry
    
    t.ok($entryData.$entry == 123, 'Correct value for `instance.$entry.$entry`')
    
    t.ok($entryData.$ref[0] == '$ref', 'Correct value for `instance.$entry.$ref[0]`')
    
    t.done()
})    