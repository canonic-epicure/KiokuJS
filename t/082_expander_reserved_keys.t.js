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
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setting up nodes & entries')
    
    var instanceID   = nodes[ 0 ].ID
    

    //======================================================================================================================================================================================================================================================
    t.diag('Round-triping nodes')
    
    var roundTrip = function (scope, backend, nodes) {
        
        var strings = backend.serialize(scope.encodeNodes(nodes))
        var nodes   = scope.decodeEntries(backend.deserialize(strings))
        
        return nodes
    }
    
    
    var nodes2          = roundTrip(scope, backend, nodes)
    var nodesByID       = {}
    
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
    
    var instance2      = scope.idToObject(instanceID)
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Checking newly created objects')
    
    t.isaOk(instance2, Some.Class, 'Correct class for `instance2`')
    
    t.ok(instance2.$ref == instance2, 'Correct self-reference')
    
    t.ok(instance2.$entry.$ref[0] == '$ref', 'Correct inner value #1')
    t.ok(instance2.$entry.$entry == 123, 'Correct inner value #2')
    
    
    t.done()
})    