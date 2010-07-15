StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.ValueWrapper', 'KiokuJS.Test.TypeMap.ValueWrapper' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,                   "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,         "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Linker.Expander,   "'KiokuJS.Linker.Expander' is here")
        t.ok(KiokuJS.Test.ValueWrapper, "'KiokuJS.Test.ValueWrapper' is here")


        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var value = new KiokuJS.Test.ValueWrapper({ value : 'someValue' })
        
        var array = [ value, value ]
        
        var graph = {
            data1 : value,
            data2 : array
        }
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard([
                {
                    meta : 'KiokuJS.Test.TypeMap.ValueWrapper'
                }
            ])
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
        
        var nodes = collapser.collapse({}, [ graph, array ])
        
        t.ok(nodes.length == 2, 'Correct number of nodes is returned')
        
        Joose.A.each(nodes, scope.pinNode, scope)
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Setting up nodes & entries')
        
        var graphNode           = scope.objectToNode(graph)
        var arrayNode           = scope.objectToNode(array)
        
        var scope2       = new KiokuJS.Scope({
            backend     : backend
        })
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Round-triping nodes')
        
        var nodes2           = backend.deserializeNodes(backend.serializeNodes(nodes))
        
        Joose.A.each(nodes2, function (node) {
            t.ok(!node.isLive(), 'Round-tripped nodes have no objects')
        })
        
        Joose.A.each(nodes2, scope2.pinNode, scope)

        
        //======================================================================================================================================================================================================================================================
        t.diag('Animating nodes')
        
        KiokuJS.Linker.Expander.expandNodes(nodes2, scope2)
        
        var graph2      = scope2.idToObject(graphNode.ID)
        var array2      = scope2.idToObject(arrayNode.ID)
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking newly created objects')
        
        
        t.done()
        
        t.endAsync(async0)
    })
})    
