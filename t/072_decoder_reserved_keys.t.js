StartTest(function(t) {
    
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

    var instanceNode2           = backend.deserializeNode(backend.serializeNode(instanceNode))
    var instanceData2           = instanceNode2.data
    
    
    t.isaOk(instanceData2.$ref, KiokuJS.Reference, 'Correct class for `instanceData2.$ref`')
    t.ok(instanceData2.$ref.ID == instanceNode2.ID, 'Correct self-reference with reserved key')
    
    t.isaOk(instanceData2.$entry, KiokuJS.Node, '`instanceData2.$ref` were decoded into separate Node')
    
    var $entryData = instanceData2.$entry.data
    
    t.ok($entryData.$entry == 123, 'Correct value for `instance.$entry.$entry`')
    
    t.isaOk($entryData.$ref, KiokuJS.Node, '`instance.$entry.$ref` were decoded into separate Node')
    t.ok($entryData.$ref.data[0] == '$ref', 'Correct value for `instance.$entry.$ref[0]`')
    
    t.done()
})    